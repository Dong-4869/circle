//服务器域名地址
var baseUrl = "http://192.168.137.1:8080/circle/"

//获取朋友圈列表接口
var getCircleList = baseUrl+"circle";

//根据朋友圈ID获取朋友圈内容接口
var getCircleById = baseUrl+"circle/";

//添加或修改朋友圈信息接口
var saveCircle = baseUrl+"circle";

//添加评论接口
var saveComment = baseUrl+"comment/save";

module.exports = {
  getCircleList:getCircleList,
  getCircleById:getCircleById,
  saveCircle:saveCircle,
  saveComment:saveComment
};