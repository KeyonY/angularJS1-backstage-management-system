/* allNavyAccount.js */
// 新增水军账号弹框下拉
		$('.dropdown').on('click', 'button', function(){
	        $(this).parent().find('.dropdown-menu').toggle();
	    })
	    $('.dropdown').on('click', 'a', function(){
	        var text = $(this).html();
	        $(this).parents('.dropdown').find('.dd_text').text(text).attr('data-managerid',$(this).attr('data-managerid'));
	        $(this).parents('.dropdown-menu').hide();
	    })
	    $('.dropdown').on('mouseleave','.dropdown-menu', function () {
	        $(this).hide();
	    })
// 更改关联小编
	$(function () {
		
		$('.main').on('click', '.btn_upload.rf', function () {
			$(this).parents('li').find('.editerNameBox').show();
		})
		$('.main').on('click', '.editerNameBox a', function () {
			var $btn = $(this).parents('li').find('.btn_upload.rf'),
				userID = $btn.attr('data-userid'),
				// managerID = $btn.attr('data-managerid'), //原managerID
				managerID = $(this).attr('data-managerid'), //新managerID
				$this = $(this);
				// $this = 'AA';
				console.log(managerID);
				// console.log(managerID_);
			$.ajax({
				type: "GET",
				url: " /ManagerAsync/ChangeWaterArmy?userID=" + userID + '&managerID=' + managerID,
				success: function (response) {
					console.log(response);
					var obj = (typeof(response)=='object'?response:JSON.parse(response));
					if(obj.success){
						$this.parents('li').find('.editor').html($this.html());
						$this.parents('li').find('.editor').attr('title',$this.html());
						$this.parents('li').find('.editor').attr('data-managerid',managerID);
						$this.parents('li').find('.btn_upload.rf').attr('data-managerid',managerID);
						$this.parent().hide();
					}
				}
			})
		})
		$('.main').on('mouseleave','.editerNameBox', function () {
			$(this).hide();
		})
		$('body').on('blur','input[name=email]',function () {
			// console.log(this.value);
			this.value = this.value.replace(/\s+/g,'');
		})
	})	
		angular.module('allNavyAccount',['allNavyAcc','checkAccess']);
		angular.module('allNavyAcc',[]).
			controller('allNavyAccountCtrl', ['$scope','$http','$timeout',function($scope,$http,$timeout){
				$scope.page = 1;        //暂存页码
            	// 翻页
                $scope.pageBtn = function (num) {
                    $scope.page = num;
                    $scope.requestListFun(num);
                }
                // 分页跳转 跳转输入验证
                $scope.jumpGo = function(){
                    var pageInp = parseInt($scope.pageInfo.pageInput);
                    if(isNaN(pageInp)){
                        $scope.isNumber = true;
                        $timeout(function(){
                            $scope.isNumber = false;
                        },3000);
                        return;
                    }else if(pageInp > $scope.pageInfo.TotalPage || pageInp < 1){
                        $scope.isMax = true;
                        $timeout(function(){
                            $scope.isMax = false;
                        },3000);
                        return;
                    }
                    $scope.requestListFun(pageInp);
                }
				//请求表格及分页数据方法
                $scope.requestListFun = function(num) {
                	$http.get('/Manager/WaterList?pageSize=12&pageWidth=5&pageindex=' + num)
	                .success(function (response) {
	                    $scope.armyList = [];	//表格数据
		            	$scope.pageInfo = {};	//分页信息
		            	$scope.pageNumInfo = [];	//页面中当前要显示页码的数组
	                    var obj = (typeof(response)=='object'?response:JSON.parse(response));
	                    console.log(obj);
	                    $scope.armyList = obj.armyList;
	                    $scope.pageInfo = obj.pageInfo;
	                    $scope.pageInfo.pageInput = obj.pageInfo.CurrentPage;
	                    for(var i = 0 ;i < (obj.pageInfo.PageEnd-obj.pageInfo.PageStart+1); i++) {
	                    	$scope.pageNumInfo.push(obj.pageInfo.PageStart+i);	//根据分页信息返回数据向页面中当前要显示页码的数组添加数字
	                    }
	                    // console.log($scope.pageInfo);
	                    // console.log($scope.pageNumInfo);
	                })
	                /*模拟服务器返回的水军账号信息*/ 
                }
                $scope.requestListFun(1);	//页面初始化 调用 1 次请求表格及分页数据方法
                // 请求所有(有上传互动作品权限的)小编的信息的方法
                $scope.requestEditorsFun = function () {
                	$http.get('/Manager/EditorList')
                	.success(function (response) {
                		var obj = (typeof(response)=='object'?response:JSON.parse(response));
                		// console.log(obj);
                		console.log(obj.managerList);
                		$scope.managerList = obj.managerList;
                	})
                }
                $scope.requestEditorsFun(); //请求小编信息
                // 删除水军账号弹框
				$scope.showConfirmFun = function (boolean,userID) {
					$scope.showConfirm = boolean;
					$scope.userID = userID;
				}
				// 删除水军账号方法
				$scope.delAccSubFun = function () {
					console.log($scope.userID);
					$http.get('/ManagerAsync/RemoveWaterArmy?userID=' + $scope.userID)
					.success(function (response) {
						console.log(typeof response, response);
						window.location.reload();
					})
					/*
					.error(function (data,status,headers,config) {
						console.log(data);
						console.log(status);
						console.log(headers);
						console.log(config);
					})
					*/
				}
				// 新增水军账号
				$scope.showAddAccountFun = function (boolean) {
					$scope.showAddAccount =  boolean;
					$scope.showRes = false;
				}
				$scope.showRes = false;
				$scope.trimFun = function () {
					$scope.showRes = false;
				}
				// 新增水军账号表单提交
				$scope.addAccSubFun = function () {
					console.log($scope.email);
					var email = $('input[name=email]').val(),
						managerID = $('.dd_text').attr('data-managerid');
					// console.log(managerID);
					if(email == undefined || email.length == 0){
						return;
					}else {
						$http.get('/ManagerAsync/SaveWaterArmy?email=' + email +'&managerID=' + managerID)
						.success(function (response) {
							var obj = (typeof(response)=='object'?response:JSON.parse(response));
							console.log(obj);
							if(obj.success){
								$scope.showAddAccount = false;
								window.location.reload();
							}else {
								// alert(obj.message);
								$scope.showRes = true;
								$scope.resMsg = obj.message;
							}
						})
						/*
						.error(function (data,status,headers,config) {
							console.log(data);
							console.log(status);
							console.log(headers);
							console.log(config);
						})
						*/
					}
				}
			}])