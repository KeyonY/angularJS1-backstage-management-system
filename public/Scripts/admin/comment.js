//错误信息提示的模态框
function errorModal(mes){
	$('#errorModal span').html(mes);
	$('#errorModal').fadeIn(200,function(){
		setTimeout(function(){
			$('#errorModal').fadeOut(300);
		},1500)
	})
}
//遍历导航栏，找到跳转的导航栏目，添加选中样式
function navSelected(text){
	var win = window.parent.frames["frameLeft"].document;
	var topWin = window.parent.parent.frames["frame_top"].document;
	$(win).find('.nl_li a').each(function(index,e){
		if($(e).html() == text){
			$(win).find('.nl_li').removeClass('nl_liSelected');
			$(e).parent().addClass('nl_liSelected');
			$(topWin).find('#mainTitle').html(text);
		}
	})
}

angular.module('commentList',['comment','commonUI']);
angular.module('comment',[])
	.config(['$locationProvider', function($locationProvider) {  
		$locationProvider.html5Mode(true);  
	}])
	.factory('commentInfo',['$http',function($http){
		return {
			//评论列表
			loadData:function(page,userid){
				if(userid != ''){
					return $http.get('/AdminReply?userID='+userid+'&pageWidth=5&pageIndex='+page);
				}else{
					return $http.get('/AdminReply?&pageWidth=5pageIndex='+page);
				}
			},
			//删除评论-单个
			remove:function(replyid){
				return $http.get('/AdminReply/Remove?Id='+replyid);
			}
		}
	}])
	//自定义过滤器 jsonDate
	.filter("jsonDate", ['$filter',function($filter) {
	   return function(input, format) {
	        //先得到时间戳
	        var timestamp = Number(input.replace(/\/Date\((\d+)\)\//, "$1"));

	        //转成指定格式
	        return $filter("date")(timestamp, format);
	   }
	}])
	.controller('commentCtrl',
		['$scope','$http','commentInfo','$timeout','$location',
		function($scope,$http,commentInfo,$timeout,$location){
			//加载数据
			var watch;
			function processData(){
				commentInfo.loadData($scope.page,$location.search().userID)
				.then(function(res){
					$scope.data = res.data;

					//遍历得到要显示的页码
					$scope.data.pageInfo.pageList = [];
					for(var i =$scope.data.pageInfo.PageStart;i<$scope.data.pageInfo.PageEnd+1;i++){
						$scope.data.pageInfo.pageList.push(i);
					}
					$scope.data.pageInfo.pageInput = $scope.data.pageInfo.CurrentPage;
					console.log($scope.data);
				})
				
			}

			//分页和关键词搜素获取数据
			$scope.page = 1;				//暂存页码
			$scope.key = '';				//暂存搜索关键字
			//翻页和搜索
			$scope.pageBtn = function(num){
				$scope.page = num;
				processData();
			}
			//跳页
			$scope.jumpGo = function(){
				var pageInp = parseInt($scope.data.pageInfo.pageInput);
				if(isNaN(pageInp)){
					$scope.isNumber = true;
					$timeout(function(){
						$scope.isNumber = false;
					},3000);
					return ;
				}else if(pageInp > $scope.data.pageInfo.TotalPage ||
				 pageInp < 1){
					$scope.isMax = true;
					$timeout(function(){
						$scope.isMax = false;
					},3000);
					return ;
				}
				$scope.page = pageInp;
				processData();
			}

			//加载页面数据
			processData();

			//全选
			// $scope.haveSelcAll = false;
			$scope.selectedAll = function(){
				/*if($scope.haveSelcAll){
					angular.forEach($scope.data.view,function(data){
						data.checked = false;
					})
					$scope.haveSelcAll = false;
					return ;
				}
				$scope.haveSelcAll = true;*/
				angular.forEach($scope.data.view,function(data){
					data.checked = true;
				})
			}

			//反选
			$scope.selectedInvert = function(){
				angular.forEach($scope.data.view,function(data){
					data.checked = !data.checked;
				})
			}
			//删除已选
			$scope.selectedDel = function(){
				$('#modal_del').fadeIn(400);
				$('#modal_del .md_sure').unbind('click').click(function(){
					$('#modal_del').fadeOut();
					var arr = [];
					angular.forEach($scope.data.view,function(data){
						if(data.checked){
							arr.push(data.Key.replyID);
							return ;
						}
					})
					// console.log(arr);
					$.ajax({
						type:"POST",
						async:true,
						url:"/AdminReply/RemoveRange",
						dataType:"json",
						data:{"data":arr},
						success:function(data){
							// data = JSON.parse(data);
							console.log(data);
							if(data.success){
								processData();
							}
						},
						error:function(XMLHttpRequest,textStatus,errorThrown) {

						}
					})
				})
				$('#modal_del .md_cancle').click(function(){
					$('#modal_del').fadeOut();
				})
			}

			//删除单个,弹窗
			$scope.deleteOne = function(obj){
				//删除弹窗
				$('#modal_del').fadeIn(400);
				$('#modal_del .md_sure').unbind('click').click(function(){
					$('#modal_del').fadeOut();
					commentInfo.remove(obj.Key.replyID)
					.then(function(res){
						console.log(res.data);
						if(!res.data.success){errorModal(res.data.message);return ;}

						processData();
					})
				})
				$('#modal_del .md_cancle').click(function(){
					$('#modal_del').fadeOut();
				})
			}

			//点击用户，跳转到用户列表并搜索该用户
			$scope.jumpUser = function(obj){
				window.location.href = '/AdminTemplate/UserControl/userList.html?key='+obj.Value.NickName;
			}

		}]);

/***********反馈列表***************反馈列表**************反馈列表***************/
angular.module('feedbackList',['feedback','commonUI'])
angular.module('feedback',[])
	.factory('feedbackInfo',['$http',function($http){
		return {
			loadData:function(status,page){
				return $http.get('/AdminReply/SuggestList?status='+status+'&pageWidth=5&pageIndex='+page);
			},
			sendSuggest:function(suggestid,content){
				if(content != ''){
					return $http.get('/AdminReply/CheckSuggest?suggestID='+suggestid+'&content='+content);
				}else{
					return $http.get('/AdminReply/CheckSuggest?suggestID='+suggestid);
				}
			},
			//删除
			delData:function(suggestid){
				return $http.get('/AdminReply/RemoveSuggest?suggestID='+suggestid);
			}
		}
	}])
	//自定义过滤器 jsonDate
	.filter("jsonDate", ['$filter',function($filter) {
	   return function(input, format) {
	        //先得到时间戳
	        var timestamp = Number(input.replace(/\/Date\((\d+)\)\//, "$1"));

	        //转成指定格式
	        return $filter("date")(timestamp, format);
	   }
	}])
	.controller('feedbackCtrl',['$scope','$http','feedbackInfo','$timeout',
		function($scope,$http,feedbackInfo,$timeout){

			$scope.page = 1;				//暂存页码
			$scope.status = 1;				//暂存是否已处理

			function processData(){
				feedbackInfo.loadData($scope.status,$scope.page)
				.then(function(res){
					$scope.data = res.data;

					//遍历得到要显示的页码
					$scope.data.pageInfo.pageList = [];
					for(var i =$scope.data.pageInfo.PageStart;i<$scope.data.pageInfo.PageEnd+1;i++){
						$scope.data.pageInfo.pageList.push(i);
					}
					$scope.data.pageInfo.pageInput = $scope.data.pageInfo.CurrentPage;
					console.log($scope.data);
				})
				$scope.data = feedbackInfo.loadDataCos;
				console.log($scope.data);
			}
			processData();

			//翻页和搜索
			$scope.pageBtn = function(num){
				$scope.page = num;
				processData();
			}
			//跳页
			$scope.jumpGo = function(){
				var pageInp = parseInt($scope.data.pageInfo.pageInput);
				if(isNaN(pageInp)){
					$scope.isNumber = true;
					$timeout(function(){
						$scope.isNumber = false;
					},3000);
					return ;
				}else if(pageInp > $scope.data.pageInfo.TotalPage ||
				 pageInp < 1){
					$scope.isMax = true;
					$timeout(function(){
						$scope.isMax = false;
					},3000);
					return ;
				}
				$scope.page = pageInp;
				processData();
			}

			//是否已处理的切换
			$scope.noDisposed = function(status){
				$scope.status = status;
				$('#checkContent').fadeOut();
				$('#modal_del').fadeOut();
				$('#replyContent').fadeOut();
				processData();
			}

			//发送回复
			$scope.replyContent = '';
			$scope.sendReply = function(obj,n){
				//如果是非注册用户，则不再弹出回复框
				if(n == 'null'){					
					feedbackInfo.sendSuggest(obj.suggestID,$scope.replyContent)
					.then(function(res){
						if(res.data.success){
							processData();
							$scope.replyContent = '';
						}else{
							errorModal(res.data.message);
						}
					})
					return ;
				}
				//发送回复弹窗
				if(obj.status == 2){
					$scope.replyContent = obj.replyContent;
					$('#checkContent').fadeIn(400);
					$('#checkContent .md_sure').unbind('click').click(function(){
						$('#checkContent').fadeOut();
						$scope.replyContent = '';
					})
					return ;
				}
				$('#replyContent').fadeIn(400);
				$('#replyContent .md_sure').unbind('click').click(function(){
					if($scope.replyContent == ''){
						errorModal('请输入回复内容');
						return ;
					}
					$('#replyContent').fadeOut();
					if(obj.user == null){
						var d = {suggestID:obj.suggestID,content:$scope.replyContent};
					}else{
						var d = {suggestID:obj.suggestID,content:$scope.replyContent,userID:obj.user.userID};
					}
					$.ajax({
						type:"POST",
						async:true,
						url:'/AdminReply/CheckSuggest',
						data:d,
						success:function(data){
							$scope.replyContent = '';
							processData();
						}
					})
				})
				$('#replyContent .md_cancle').click(function(){
					$('#replyContent').fadeOut();
				})
				
			}

			//删除
			$scope.delete = function(obj){
				//删除弹窗
				$('#modal_del').fadeIn(400);
				$('#modal_del .md_sure').unbind('click').click(function(){
					$('#modal_del').fadeOut();
					feedbackInfo.delData(obj.suggestID)
					.then(function(res){
						console.log(res.data);
						if(!res.data.success){errorModal(res.data.message);return ;}

						processData();
					})
				})
				$('#modal_del .md_cancle').unbind('click').click(function(){
					$('#modal_del').fadeOut();
				})
			}
		}])


/*******新增反馈*********新增反馈**********新增反馈********/
//增加焦点图的上传图片
function uploadImg(){
	$('#uploadImg').change(function(){
		imgPass = false;
console.log(111);
		//验证是否已选图片
		if($('#uploadImg').val() == '') return ;
		document.getElementById('imgForm').submit();
	})
}
function upShowCallback(r, c, m) {
	if(r){
	    $('#pic').val(m);					//给pic赋值
	    $('#showCover').attr('src',m);
	    $('#showCover').css('float','none');
	    imgPass = true;
	}
	else{
		if(m == '程序异常'){
			errorModal('异常文件');
			return ;
		}
	    errorModal(m);
	}
}