# Testerika Flutter Frontend Implementation Guide (GetX Architecture)

This document provides a comprehensive step-by-step implementation guide for building the mobile frontend in **Flutter** using the **GetX State Management** framework (aligned with Testerika's premium UI standards).

---

## 1. Directory Structure & Architecture
To keep the application highly scalable, clean, and modular, we follow a feature-based structure:

```
lib/
├── models/
│   ├── course_model.dart
│   ├── subject_model.dart
│   ├── quiz_model.dart
│   └── quiz_attempt_model.dart
├── services/
│   └── api_service.dart
├── controllers/
│   ├── quiz_browsing_controller.dart
│   ├── quiz_registration_controller.dart
│   ├── quiz_gameplay_controller.dart
│   └── user_dashboard_controller.dart
└── views/
    ├── course_subject_quiz_screen.dart
    ├── registered_quizzes_screen.dart
    ├── quiz_gameplay_screen.dart
    ├── quiz_result_screen.dart
    └── attempted_resumed_screen.dart
```

---

## 2. Core Flutter Models (Dart)

### Course, Subject & Quiz Models
Let's declare the standard models mapping perfectly to the JSON returns from our microservices.

```dart
// lib/models/course_model.dart
class CourseModel {
  final int id;
  final String courseName;
  final String? image;

  CourseModel({required this.id, required this.courseName, this.image});

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    return CourseModel(
      id: json['id'],
      courseName: json['course_name'],
      image: json['image'],
    );
  }
}

// lib/models/subject_model.dart
class SubjectModel {
  final int id;
  final String subjectName;
  final List<int> courseIds;

  SubjectModel({required this.id, required this.subjectName, required this.courseIds});

  factory SubjectModel.fromJson(Map<String, dynamic> json) {
    var courses = json['course_ids'] != null ? List<int>.from(json['course_ids']) : <int>[];
    return SubjectModel(
      id: json['id'],
      subjectName: json['subject_name'],
      courseIds: courses,
    );
  }
}

// lib/models/quiz_model.dart
class QuizModel {
  final int id;
  final String key;
  final String name;
  final int duration;
  final int totalQuestions;
  final double marks;
  final String language;
  final DateTime? startDate;
  final double? entryFee;
  final double? prizePool;
  final double? firstPrize;
  final int? totalSpots;
  
  QuizModel({
    required this.id,
    required this.key,
    required this.name,
    required this.duration,
    required this.totalQuestions,
    required this.marks,
    required this.language,
    this.startDate,
    this.entryFee,
    this.prizePool,
    this.firstPrize,
    this.totalSpots,
  });

  factory QuizModel.fromJson(Map<String, dynamic> json) {
    var dates = json['dates'];
    var prize = json['prize'];
    
    return QuizModel(
      id: json['id'],
      key: json['key'] ?? '',
      name: json['name'] ?? '',
      duration: json['duration'] ?? 0,
      totalQuestions: json['total_questions'] ?? 0,
      marks: double.tryParse(json['marks'].toString()) ?? 0.0,
      language: json['language'] ?? 'English',
      startDate: dates != null && dates['start_date'] != null 
          ? DateTime.parse(dates['start_date']) 
          : null,
      entryFee: prize != null ? double.tryParse(prize['entry_fee'].toString()) : 0.0,
      prizePool: prize != null ? double.tryParse(prize['prize_pool'].toString()) : 0.0,
      firstPrize: prize != null ? double.tryParse(prize['first_prize'].toString()) : 0.0,
      totalSpots: prize != null ? int.tryParse(prize['total_spots'].toString()) : 0,
    );
  }
}
```

---

## 3. Network & API Service
A centralized HTTP service using `GetConnect` or `Dio` to query endpoints securely with automatic Bearer token handling.

```dart
// lib/services/api_service.dart
import 'package:get/get.dart';

class ApiService extends GetConnect {
  static const String baseUrl = "https://gateway.testerika.com/api"; // KrakenD Port 8080
  
  @override
  void onInit() {
    httpClient.baseUrl = baseUrl;
    httpClient.timeout = const Duration(seconds: 15);
    
    // Attach authorization tokens to headers
    httpClient.addRequestModifier<dynamic>((request) {
      String? token = Get.find<AuthController>().token;
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      return request;
    });
  }
}
```

---

## 4. Requirement Implementation (GetX Controllers & UI)

### 📌 Process 1: Selection Flow (Course -> Subject -> Quizzes)
**Aesthetics**: Glassmorphism categories, hover transitions, and a clean search bar.

#### Controller Code:
```dart
// lib/controllers/quiz_browsing_controller.dart
import 'package:get/get.dart';
import '../models/course_model.dart';
import '../models/subject_model.dart';
import '../models/quiz_model.dart';
import '../services/api_service.dart';

class QuizBrowsingController extends GetxController {
  final ApiService _api = Get.find<ApiService>();

  var courses = <CourseModel>[].obs;
  var subjects = <SubjectModel>[].obs;
  var quizzes = <QuizModel>[].obs;

  var selectedCourse = Rxn<CourseModel>();
  var selectedSubject = Rxn<SubjectModel>();

  var isLoadingCourses = false.obs;
  var isLoadingSubjects = false.obs;
  var isLoadingQuizzes = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchCourses();
  }

  void fetchCourses() async {
    isLoadingCourses.value = true;
    var res = await _api.get('/common/course/getAll');
    if (res.isOk && res.body != null) {
      courses.assignAll((res.body as List).map((x) => CourseModel.fromJson(x)).toList());
    }
    isLoadingCourses.value = false;
  }

  void selectCourse(CourseModel course) {
    selectedCourse.value = course;
    selectedSubject.value = null;
    quizzes.clear();
    fetchSubjectsForCourse(course.id);
  }

  void fetchSubjectsForCourse(int courseId) async {
    isLoadingSubjects.value = true;
    var res = await _api.get('/common/subject/getAll?course_id=$courseId');
    if (res.isOk && res.body != null) {
      subjects.assignAll((res.body as List).map((x) => SubjectModel.fromJson(x)).toList());
    }
    isLoadingSubjects.value = false;
  }

  void selectSubject(SubjectModel subject) {
    selectedSubject.value = subject;
    fetchQuizzes(subject.id);
  }

  void fetchQuizzes(int subjectId) async {
    isLoadingQuizzes.value = true;
    var res = await _api.get('/quiz/quiz/quizzes/status/get?category=$subjectId&type=Quizzes');
    if (res.isOk && res.body != null) {
      var quizList = res.body['data'] as List;
      quizzes.assignAll(quizList.map((x) => QuizModel.fromJson(x)).toList());
    }
    isLoadingQuizzes.value = false;
  }
}
```

---

### 📌 Process 2: Direct Registration & Payment Gateway Flow
**Direct Payout flow**: No intermediate wallet service is used. If the quiz has a registration fee, we launch Razorpay/Stripe on the client side. Upon payment success, the transaction ID is directly passed as parameters to `/quiz/userRegistration` to complete registration.

#### Controller Code:
```dart
// lib/controllers/quiz_registration_controller.dart
import 'package:get/get.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../models/quiz_model.dart';
import '../services/api_service.dart';

class QuizRegistrationController extends GetxController {
  final ApiService _api = Get.find<ApiService>();
  late Razorpay _razorpay;
  QuizModel? _currentQuiz;

  @override
  void onInit() {
    super.onInit();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
  }

  void startRegistrationFlow(QuizModel quiz) async {
    _currentQuiz = quiz;
    double fee = quiz.entryFee ?? 0.0;

    if (fee == 0.0) {
      // Free Quiz direct call
      registerUser(quizId: quiz.id);
    } else {
      // Paid Quiz Flow: Start Payment Gateway sheet
      var options = {
        'key': 'rzp_live_XXXXXXXXXXXXXX',
        'amount': (fee * 100).toInt(), // in paise
        'name': 'Testerika Quizzes',
        'description': 'Direct Registration for ${quiz.name}',
        'prefill': {'contact': '9999999999', 'email': 'user@testerika.com'}
      };
      
      try {
        _razorpay.open(options);
      } catch (e) {
        Get.snackbar("Error", "Could not initialize payment gateway.");
      }
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    if (_currentQuiz == null) return;
    
    // Direct payment verified: Register user passing transaction details directly to registration API
    registerUser(
      quizId: _currentQuiz!.id,
      transactionId: response.paymentId,
      paymentStatus: "SUCCESS",
      amountPaid: _currentQuiz!.entryFee,
    );
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    Get.snackbar("Payment Failed", "Transaction declined: ${response.message}");
  }

  void registerUser({
    required int quizId,
    String? transactionId,
    String? paymentStatus,
    double? amountPaid,
  }) async {
    var payload = {
      'id': quizId,
      'user_id': Get.find<AuthController>().userId,
      if (transactionId != null) 'transaction_id': transactionId,
      if (paymentStatus != null) 'payment_status': paymentStatus,
      if (amountPaid != null) 'amount_paid': amountPaid,
    };

    var res = await _api.post('/quiz/quiz/userRegistration', payload);

    if (res.isOk && res.body['success'] == true) {
      Get.snackbar("Success", "Registered successfully!");
      Get.find<RegisteredQuizzesController>().fetchRegisteredQuizzes();
    } else {
      Get.snackbar("Error", res.body['message'] ?? "Registration failed.");
    }
  }

  @override
  void onClose() {
    _razorpay.clear();
    super.onClose();
  }
}
```

---

### 📌 Process 3 & 4: Registered Quizzes & Real-time Gameplay
**Timers**: Displays registered quizzes with active visual countdowns. When the countdown reaches `0`, the "Start Quiz" button unlocks. During the quiz, each question has an individual timeline that auto-submits options.

#### Controller Code:
```dart
// lib/controllers/quiz_gameplay_controller.dart
import 'dart:async';
import 'package:get/get.dart';
import '../models/quiz_model.dart';
import '../services/api_service.dart';

class QuizGameplayController extends GetxController {
  final ApiService _api = Get.find<ApiService>();

  var questions = <dynamic>[].obs;
  var currentQuestionIndex = 0.obs;
  var selectedOptionId = Rxn<int>();
  
  var secondsRemaining = 0.obs;
  Timer? _timer;

  // Active status details
  var isSubmitting = false.obs;
  var quizCompleted = false.obs;

  void startQuiz(QuizModel quiz) async {
    // 1. Initialize Quiz on Backend (validates that user is registered)
    var initRes = await _api.post('/quiz/quiz/intializedQuizAnalysisStatus/status', {
      'user_id': Get.find<AuthController>().userId,
      'quiz_id': quiz.id
    });

    if (initRes.isOk && initRes.body['success'] == true) {
      // 2. Load Quiz details & questions
      var quizDetailRes = await _api.get('/quiz/quiz/getQuizDetailForgettingQuestion/${quiz.key}/${Get.find<AuthController>().userId}');
      if (quizDetailRes.isOk) {
        questions.assignAll(quizDetailRes.body['quiz']['questions']);
        secondsRemaining.value = quiz.duration * 60; // Minutes to seconds
        startTimer(quiz.id);
        Get.toNamed('/quiz-gameplay');
      }
    } else {
      Get.snackbar("Error", initRes.body['message'] ?? "Cannot start quiz now.");
    }
  }

  void startTimer(int quizId) {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (secondsRemaining.value > 0) {
        secondsRemaining.value--;
      } else {
        autoSubmitQuiz(quizId);
      }
    });
  }

  void submitOption(int quizId, int questionId, int optionId) async {
    selectedOptionId.value = optionId;
    await _api.post('/quiz/quiz/submitQuizQuestionAnswer', {
      'user_id': Get.find<AuthController>().userId,
      'quiz_id': quizId,
      'question_id': questionId,
      'option_id': optionId,
      'total_questions': questions.length,
      'time_taken': (questions.length * 60) - secondsRemaining.value // elapsed
    });
  }

  void nextQuestion() {
    if (currentQuestionIndex.value < questions.length - 1) {
      currentQuestionIndex.value++;
      selectedOptionId.value = null;
    }
  }

  void autoSubmitQuiz(int quizId) async {
    _timer?.cancel();
    isSubmitting.value = true;
    
    var res = await _api.post('/quiz/quiz/submitQuizResult/result/submit', {
      'user_id': Get.find<AuthController>().userId,
      'quiz_id': quizId
    });

    isSubmitting.value = false;
    if (res.isOk) {
      Get.offAndToNamed('/quiz-result', arguments: {'quiz_id': quizId});
    }
  }
}
```

---

### 📌 Process 5 & 6: Resumed, Attempted, & Leaderboard Screens
**Logic**: Lists in-progress attempts (resumed quizzes) and previous attempts in different tabs of the profile section. Calculates prize payouts dynamically.

```dart
// lib/controllers/user_dashboard_controller.dart
import 'package:get/get.dart';
import '../services/api_service.dart';

class UserDashboardController extends GetxController {
  final ApiService _api = Get.find<ApiService>();

  var resumedQuizzes = <dynamic>[].obs;
  var completedQuizzes = <dynamic>[].obs;

  var isLoadingResumed = false.obs;
  var isLoadingCompleted = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchResumedQuizzes();
    fetchCompletedQuizzes();
  }

  void fetchResumedQuizzes() async {
    isLoadingResumed.value = true;
    int userId = Get.find<AuthController>().userId;
    var res = await _api.get('/quiz/quiz/getUserAttemptedQuizzes/$userId?status=progress');
    
    if (res.isOk && res.body != null) {
      resumedQuizzes.assignAll(res.body['data']);
    }
    isLoadingResumed.value = false;
  }

  void fetchCompletedQuizzes() async {
    isLoadingCompleted.value = true;
    int userId = Get.find<AuthController>().userId;
    var res = await _api.get('/quiz/quiz/getUserAttemptedQuizzes/$userId?status=completed');
    
    if (res.isOk && res.body != null) {
      completedQuizzes.assignAll(res.body['data']);
    }
    isLoadingCompleted.value = false;
  }
}
```

---

## 5. UI Architecture Details (Dart Views)

### Golden / Trophies Leaderboard Details Screen (Dart Mockup)
A dynamic screen using dark blue neon glassmorphism backgrounds to highlight rank and prize won:

```dart
// lib/views/quiz_result_screen.dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class QuizResultScreen extends StatelessWidget {
  const QuizResultScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Sleek Slate Dark Mode
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 30),
                const Text(
                  "LEADERBOARD RESULT",
                  style: TextStyle(
                    fontSize: 24, 
                    fontWeight: FontWeight.bold, 
                    color: Colors.amber, 
                    letterSpacing: 2.0
                  ),
                ),
                const SizedBox(height: 20),
                
                // Silver, Gold, Bronze Ranks Illustration
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _buildPodium(rank: 2, height: 100, name: "Suresh K.", color: Colors.blueGrey),
                    _buildPodium(rank: 1, height: 140, name: "Ananya S. (You)", color: Colors.amber),
                    _buildPodium(rank: 3, height: 80, name: "Vikram R.", color: Colors.brown),
                  ],
                ),
                
                const SizedBox(height: 30),
                
                // Prize & Result Cards
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.1)),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        "CONGRATULATIONS!",
                        style: TextStyle(fontSize: 18, color: Colors.white70, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "You Won: ₹500.00",
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.black,
                          color: Colors.emeraldAccent.shade400,
                          shadows: [
                            Shadow(color: Colors.emerald.withOpacity(0.5), blurRadius: 10)
                          ]
                        ),
                      ),
                      const Divider(color: Colors.white12, height: 30),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatItem("Rank", "#2"),
                          _buildStatItem("Accuracy", "93%"),
                          _buildStatItem("Points", "110"),
                        ],
                      )
                    ],
                  ),
                ),
                
                const Spacer(),
                ElevatedButton(
                  onPressed: () => Get.offAllNamed('/home'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.amber,
                    padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: const Text("BACK TO HOME", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPodium({required int rank, required double height, required String name, required Color color}) {
    return Column(
      children: [
        Text(name, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Container(
          width: 80,
          height: height,
          decoration: BoxDecoration(
            color: color.withOpacity(0.8),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
            boxShadow: [
              BoxShadow(color: color.withOpacity(0.3), blurRadius: 12, spreadRadius: 2)
            ]
          ),
          child: Center(
            child: Text(
              "$rank",
              style: const TextStyle(fontSize: 36, fontWeight: FontWeight.black, color: Colors.white),
            ),
          ),
        )
      ],
    );
  }

  Widget _buildStatItem(String title, String value) {
    return Column(
      children: [
        Text(title, style: const TextStyle(color: Colors.white38, fontSize: 14)),
        const SizedBox(height: 5),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
```
