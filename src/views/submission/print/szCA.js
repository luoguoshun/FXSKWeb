import $ from 'jquery'
var urlPrefix = 'http://localhost:55668/CaApi2'

const api={
/**
 * 3.1、获取用户列表
 * @returns {Array}
 * @constructor
 */
SZWJ_GetUserList() {
    var respResult = []
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_GetUserList',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.2、用户登录
 * @param businessOrgCode 深圳市卫生计生组织机构代码
 * @param businessSystemCode 深圳市CA业务系统编码
 * @param sn 证书sn码
 * @param pwd 证书密码
 * @returns {Array}
 * @constructor
 */
 SZWJ_Login(businessOrgCode, businessSystemCode, sn, pwd) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        businessSystemCode: businessSystemCode,
        sn: sn,
        pwd: pwd
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_Login',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
            console.log(response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown)
            console.log(response)
        },
        async: false
    })
    return respResult
},

/**
 * 3.3、数据签名
 * @param businessOrgCode 深圳市卫生计生组织机构代码
 * @param businessSystemCode 深圳市CA业务系统编码
 * @param businessTypeCode 深圳市CA业务类型编码
 * @param encryptedToken 动态口令，通过4.1接口获取
 * @param data 签名原文，需要通过3.15接口进行base64编码
 * @param detach 是否带原文（此参数失效）
 * @param withTsa 是否进行时间戳签名
 * @returns {Array}
 * @constructor
 */
 SZWJ_SignData(businessOrgCode, businessSystemCode, businessTypeCode,
    encryptedToken, data, detach, withTsa) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        businessSystemCode: businessSystemCode,
        businessTypeCode: businessTypeCode,
        encryptedToken: encryptedToken,
        data: data,
        detach: detach,
        withTsa: withTsa
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_SignData',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 数据签名（通过序列号，过期方法，不推荐使用）
 * @param businessOrgCode
 * @param businessSystemCode
 * @param businessTypeCode
 * @param sn
 * @param data
 * @param detach
 * @param withTsa
 * @returns {Array}
 * @constructor
 */
 SZWJ_SignDataBySN(businessOrgCode, businessSystemCode,
    businessTypeCode, sn, data, detach, withTsa) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        businessSystemCode: businessSystemCode,
        businessTypeCode: businessTypeCode,
        sn: sn,
        data: data,
        detach: detach,
        withTsa: withTsa
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_SignData',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.4、数据签名验证
 * @param businessOrgCode 深圳市卫生计生组织机构代码
 * @param businessSystemCode 深圳市CA业务系统编码
 * @param encryptedToken 动态口令，通过4.1接口获取
 * @param data 签名原文，与3.3接口传入的签名原文需一致
 * @param signValue 签名值
 * @param detach 是否带原文（此参数失效）
 * @returns {Array}
 * @constructor
 */
 SZWJ_VerSignData(businessOrgCode, encryptedToken, data, signValue,
    detach) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        // businessSystemCode: businessSystemCode,
        encryptedToken: encryptedToken,
        data: data,
        signValue: signValue,
        detach: detach
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_VerSignData',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.5、获取证书唯一值
 * @param sn 证书sn码
 * @returns {Array}
 * @constructor
 */
 SZWJ_GetCheckKey(sn) {
    var respResult = []
    var reqBody = {
        sn: sn
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_GetCheckKey',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.6、获取Base64编码格式证书
 * @param sn 证书sn码
 * @returns {Array}
 * @constructor
 */
 SZWJ_GetUserCert(sn) {
    var respResult = []
    var reqBody = {
        sn: sn
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_GetUserCert',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.7、获取证书签章图片
 * @param sn 证书sn码
 * @returns {Array}
 * @constructor
 */
 SZWJ_GetPicBySN(req) {
    var respResult = []
    // var reqBody = {
    //     sn: sn
    // }
    var reqBody = {
      encryptedToken: req.token
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_GetPicBySN',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.8、PDF签章（关键字）
 * @param businessOrgCode 深圳市卫生计生组织机构代码
 * @param businessSystemCode 深圳市CA业务系统编码
 * @param businessTypeCode 深圳市CA业务类型编码
 * @param encryptedToken 动态口令，通过4.1接口获取
 * @param pdfByte 需要签章的pdf base64格式字节流
 * @param keyWord 签章关键字
 * @param position pdf签章坐标
 * @param otherSignDetails 其他签名信息
 * @param withTsa 是否进行时间戳签名，true是、false否
 * @returns {Array}
 * @constructor
 */
 SZWJ_SignPDFByKeyWord(businessOrgCode, businessSystemCode, 
    businessTypeCode, fileCode, fileName, patientId, isPatientSign,
    encryptedToken, pdfByte, keyWord, position, withTsa, otherSignDetails) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        businessSystemCode: businessSystemCode,
        businessTypeCode: businessTypeCode,
        fileCode: fileCode,
        fileName: fileName,
        patientId: patientId,
        isPatientSign: isPatientSign,
        encryptedToken: encryptedToken,
        pdfByte: pdfByte,
        keyWord: keyWord,
        position: position,
        withTsa: withTsa,
        otherSignDetails: otherSignDetails
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_SignPDFByKeyWord',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.9、获取证书颁发机构
 * @param sn 证书sn码
 * @returns {Array}
 * @constructor
 */
 SZWJ_GetAuthorityBySN(sn) {
    var respResult = []
    var reqBody = {
        sn: sn
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_GetAuthorityBySN',
        type: 'POST',
        data: reqBody,
        timeout: 2000,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.12、单点启动目标对象
 * @param businessOrgCode 深圳市卫生计生组织机构代码
 * @param businessSystemCode 深圳市CA业务系统编码
 * @param ticket 票据（单次有效）
 * @param type 目标对象类型
 * @param path 目录对象可执行程序的本地路径
 * @param url 当type为1时有效，为目标对象的URL
 * @returns {Array}
 * @constructor
 */
 SZWJ_SsoStartTargetObject(businessOrgCode, businessSystemCode, ticket,
    type, path, url) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        businessSystemCode: businessSystemCode,
        ticket: ticket,
        type: type,
        path: path,
        url: url
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/Tools/SZWJ_SsoStartTargetObject',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.15、Base64编码
 * @param data 签名原文
 * @returns {Array}
 * @constructor
 */
 SZWJ_Base64Encode(data) {
    var respResult = []
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/Tools/SZWJ_Base64Encode',
        type: 'POST',
        data: data,
		contentType:'text/plain',
        timeout: 2000,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.16、获取证书基本信息
 * @param sn 证书sn码
 * @param type 信息类型
 * @returns {Array}
 * @constructor
 */
 SZWJ_GetCertInfo(sn, type) {
    var respResult = []
    var reqBody = {
        sn: sn,
        type: type
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/Tools/SZWJ_GetCertInfo',
        type: 'POST',
        data: reqBody,
        timeout: 2000,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 获取中间件客户端Id
 * @returns 客户端Id
 * @constructor
 */
 SSO_GetClientId() {
    var respResult = []
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SSO_GetClientId',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 3.17、启动统一登录组件
 * @param businessOrgCode 深圳市卫生计生组织机构代码
 * @param businessSystemCode 深圳市CA业务系统编码
 * @param businessSystemAppID 业务系统应用ID，业务系统的唯一标识号。
 * @returns {Array}
 * @constructor
 */
 SZWJ_LoginByComponents(req) {
    var respResult = []
    // var reqBody = {
    //     businessOrgCode: businessOrgCode,
    //     businessSystemCode: businessSystemCode,
    //     businessSystemAppID: businessSystemAppID
    // }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_LoginByComponents',
        type: 'POST',
        data: req,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 获取程序在本机的位置
 * @param  searchStr 搜索名称
 * @param  extName 程序后缀名
 */
 SZWJ_SearchName(searchStr, extName) {
    var respResult = []

    var reqBody = {
        SearchStr: searchStr,
        ExtName: extName
    }

    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/Tools/SZWJ_SearchName',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},

/**
 * 上传待患者签名文书
 * @param businessOrgCode 深圳市卫生计生组织机构代码。
 * @param businessSystemCode 深圳市CA业务系统编码。
 * @param businessSystemAppID 业务系统应用ID，业务系统的唯一标识号。
 * @param businessTypeCode 深圳市CA业务类型编码。
 * @param encryptedToken 登录成功后得到的加密令牌。
 * @param pdfClientId 手写签名客户端id
 * @param fileType 文件类型
 * @param fileName 文件名
 * @param patientId 患者唯一Id
 * @param patientName 患者姓名
 * @param gender 患者性别
 * @param age 年龄
 * @param pdfByte 需要签章的PDF文件base64格式字节流
 * @param sourceData base64编码原文
 * @returns {Array}
 * @constructor
 */
 SZWJ_PatientSign(businessOrgCode, businessSystemCode, businessSystemAppID,
    businessTypeCode, encryptedToken, pdfClientId, fileType, fileName, 
    patientId, patientName, gender, age, pdfByte, sourceData) {
    var respResult = []
    var reqBody = {
        businessOrgCode: businessOrgCode,
        businessSystemCode: businessSystemCode,
        businessSystemAppID: businessSystemAppID,
        businessTypeCode: businessTypeCode,
        encryptedToken: encryptedToken,
        pdfClientId: pdfClientId,
        fileType: fileType,
        fileName: fileName,
        patientId: patientId,
        patientName: patientName,
        gender: gender,
        age: age,
        pdfByte: pdfByte,
        sourceData: sourceData
    }
    $.support.cors = true
    $.ajax({
        url: urlPrefix + '/SZWJ_PatientSign',
        type: 'POST',
        data: reqBody,
        dataType: 'json',
        success: function (response) {
            respResult = response
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
        },
        async: false
    })
    return respResult
},
/**
 * 验证登录，获取token
 */
Verifyboundvalue(req){
  var respResult = {}
  const verifyLoginReq = 
  {
      businessOrgCode : req.businessOrgCode,//组织机构代码
      businessSystemCode :req.businessSystemCode,//业务系统编码
      businessSystemAppID :req.businessSystemAppID,//业务系统唯一标识
      authority : req.authority,//授权服务器，由 317 接口获取
      // sn = String.Empty,
      signCert : req.signCert,//base64 编码格式证书，由 317 接口获取
      boundValue : req.boundValue//登录签名值，由 317 接口获取
  }
  $.support.cors = true
  $.ajax({
      url: req.authServerAddr + 'v1.0/login/verifyboundvalue',
      type: 'POST',
      data: verifyLoginReq,
      dataType: 'json',
      success: function (response) {
          respResult = response
      },
      error: function (jqXHR, textStatus, errorThrown) {
          // alert(errorThrown);
      },
      async: false
  })
  return respResult
}
}
export default api