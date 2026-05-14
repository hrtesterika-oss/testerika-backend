require('dotenv').config();
const { uploadImage } = require('../middleware/fileUploader');
const dbContext = require("../models");
const Options = dbContext.Options
const fs = require('fs')
const Staff = dbContext.Staff
const StaffPermissions = dbContext.StaffPermissions
const Roles = dbContext.Roles
const Permissions = dbContext.Permissions

exports.findAll = async (req, res) => {
    try {
        const data = await Options.findAll({ where: { auto_load: 1 }, order: [["id", "ASC"]] });
        return res.status(200).json({
            success: true,
            data
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "500 Internal Server Error"
        })
    }
}

exports.create = async (req, res) => {
    try {
        const { name, value } = req.body
        const data = await Options.create(req.body)
        if (data) {
            return res.status(200).json({
                success: true,
                message: "Details Created Successfully"
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "500 Internal server error"
        })
    }
}

exports.findByName = async (req, res) => {
    try {
        const { name } = req.params
        const data = await Options.findOne({
            where: { name }
        });
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json(err);
    }
}

exports.upload = async (req, res) => {
    try {
        const file = req.file
        let image = ''
        if (file) {
            let data = await uploadImage(file)
            if (data && data.Location) {
                image = data.Location
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } else {
                return res.status(500).send('Error in uploading Image!')
            }
        }
        return res.status(200).json({
            success: true,
            image: image
        })
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    try {
        const { name, value } = req.body
        const [count, data] = await Options.update({ name, value }, {
            where: { name },
            returning: true
        });

        return res.status(200).json({
            success: true,
            message: "Details updated Successfully"
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "500 Internal server error"
        })
    }
}

exports.updateByName = async (req, res) => {
    try {
        let { name } = req.params
        let { value } = req.body
        const data = await Options.findOne({ where: { name } })
        if (data.value.includes(value)) {
            return res.status(200).json({
                success: false,
                message: "Category Already Present"
            })
        }
        data.value = [...data.value, value]
        await Options.update({ value: data?.value }, {
            where: { name }
        });

        return res.status(200).json({
            success: true,
            message: "Category updated Successfully"
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "500 Internal server error"
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await Options.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.getAuthorizedAsideMenu = async (req, res) => {
    try {
        const { id } = req.params
        const staff = await Staff.findOne({
            where: { id },
            include: [
                {
                    model: StaffPermissions,
                    as: 'permissions',
                    required: false
                }
            ]
        })

        const asideMenuList = await Options.findOne({
            where: {
                name: "aside_menu"
            }
        })

        //filter Authorized permission name
        if (staff && staff?.id) {
            let staffPermissionsIds = staff?.permissions?.map((item) => item.permission_id)

            let findAllStaffPermission = await Permissions.findAll({
                where: {
                    id: staffPermissionsIds
                }
            })
            if(findAllStaffPermission && findAllStaffPermission?.length>0){
                let staffPermissionsAuthorized = []
                staff?.permissions?.map((item) => {
                    findAllStaffPermission.map((item2) => {
                        if (item2.id === item.permission_id) {
                            let newObj = {
                                permission_id: item.permission_id,
                                can_view: item.can_view,
                                can_view_own: item.can_view_own,
                                can_edit: item.can_edit,
                                can_create: item.can_create,
                                can_delete: item.can_delete,
                                staff_id: item.staff_id,
                                permission_name: item2.name
                            }
                            staffPermissionsAuthorized.push(newObj)
                        }
                    })
                })
    
    
                if (staff?.admin) {
                    // console.log("executed:    ",asideMenuList)
                    let newDataArr = []
                    let filterMenu = asideMenuList.value?.filter((dataItem, index) => {
                        if (typeof dataItem.name === "string" && dataItem?.status === 1) {
                            newDataArr.push(dataItem)
                        }
                        if (typeof dataItem.name !== "string" && dataItem.name.status === 1) {
                            let filterVar = dataItem.name.value.filter((item2) => {
                                if (item2.status === 1) {
                                    newDataArr.push(dataItem)
                                } else {
    
                                }
                            })
                        }
                    })
                    const key = 'label';
                    let arrayUniqueByKey = [...new Map(newDataArr.map(item => [item.name[key], item])).values()];
                    arrayUniqueByKey = [...new Map(newDataArr.map(item => [item.name, item])).values()];
                    let finalArr = []
                    let FinalFilterArrUsingStatus = arrayUniqueByKey.filter((item) => {
                        if (typeof item.name === "object") {
                            item.name.value = item.name.value.filter((item2) => {
                                if (item2.status === 1) {
                                    return item2
                                }
                            })
                            finalArr.push(item)
                        } else {
                            finalArr.push(item)
                        }
                    })
                    return res.status(200).json({
                        success: true,
                        data: finalArr,
                        permissions: staffPermissionsAuthorized
                    })
                }
    
                let staffIds = staff.permissions.map((item) => item?.permission_id)
                const permissionList = await Permissions.findAll({ where: { id: staffIds } })
                let permissionName = permissionList.map((item) => item?.name)
                let newDataArr = []
                let filterMenu = asideMenuList.value?.filter((dataItem, index) => {
                    if (typeof dataItem.name === "string" && dataItem?.status === 1 && permissionName?.includes(dataItem.name)) {
                        newDataArr.push(dataItem)
                    }
                    if (typeof dataItem.name !== "string" && dataItem.name.status === 1) {
                        let filterVar = dataItem.name.value.filter((item2) => {
                            if (permissionName.includes(item2.name) && item2.status === 1) {
                                newDataArr.push(dataItem)
                            } else {
    
                            }
                        })
                    }
                })
                const key = 'label';
                const arrayUniqueByKey = [...new Map(newDataArr.map(item => [item.name[key], item])).values()];
                let finalArr = []
                let FinalFilterArrUsingStatus = arrayUniqueByKey.filter((item) => {
                    if (typeof item.name === "object") {
                        item.name.value = item.name.value.filter((item2) => {
                            if (item2.status === 1 && permissionName?.includes(item2?.name)) {
                                return item2
                            }
                        })
                        finalArr.push(item)
                    } else {
                        finalArr.push(item)
                    }
                })
    
                if (finalArr) {
                    return res.status(200).json({
                        success: true,
                        data: finalArr,
                        permissions: staffPermissionsAuthorized
                    })
                }
            }
           
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}