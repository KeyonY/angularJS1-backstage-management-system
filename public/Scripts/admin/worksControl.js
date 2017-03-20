angular.module('worksListPro',['worksList','commonUI']);
angular.module('worksList',[])
	.config(['$locationProvider', function($locationProvider) {  
		$locationProvider.html5Mode(true);  
	}])
	.factory('worksInfo',['$http',function($http){
		return {
			//未处理数据
			loadData:function(cate,page,key){
				if(cate == 0 || cate == undefined){
					return $http.get('/json/AdminWorks?haveEdit=false&haveChecked=0&pageWidth=5&pageIndex='+page);
				}else{
					return $http.get('/json/AdminWorks?haveEdit=false&haveChecked=0&cate='+cate+'&pageWidth=5&pageIndex='+page);
				}
			},
			//已处理数据
			loadDisposed:function(cate,page,recommend,key){
				if(cate == 0 || cate == undefined){
					return $http.get('/json/AdminWorks?haveEdit=false&haveChecked=1&pageWidth=5&pageIndex='+page+(recommend==0?'':'&recommend='+recommend));
				}else{
					return $http.get('/json/AdminWorks?haveEdit=false&haveChecked=1&cate='+cate+'&pageWidth=5&pageIndex='+page+(recommend==0?'':'&recommend='+recommend));
				}
			},
			//带有关键词key时，直接进行搜索
			searchData:function(key,page){
				return $http.get('/json/AdminWorks?pageWidth=5&pageIndex='+page+'&key='+key);
			},
			getClass:function(){
				return $http.get('/json/WorksClass');
			},
			changeClass:function(worksid,userid,cate){
				return $http.get('/json/AdminWorks/ChangeCategory?worksID='+worksid+'&userID='+userid+'&cate='+cate);
			},
			//删除单个
			remove:function(worksid,userid){
				return $http.get('/json/AdminWorks/Remove?worksID='+worksid+'&userID='+userid);
			},
			//审核接口 status /0通过不推荐 2推荐至首页 4推荐
			recommend:function(worksid,userid,status){
				return $http.get('/json/AdminWorks/Recommend?worksID='+worksid+'&userID='+userid+'&status='+status);
			},
			//未通过的审核接口
			refuseCheck:function(worksid){
				return $http.get('/json/AdminWorks/RefuseCheck?worksID='+worksid);
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
	.controller('worksListCtrl',
		['$scope','$http','worksInfo','$timeout','$location',
		function($scope,$http,worksInfo,$timeout,$location){

			//分页和关键词搜素获取数据
			$scope.page = 1;				//暂存页码
			$scope.keywords = '';			//暂存搜索关键字
			$scope.cate = 0;				//暂存类别
			$scope.dispose = false;			//暂存已通过和未通过状态
			$scope.recommends = 0;			//暂存推荐类型

			//加载数据
			var watch;
			function processData(haveChecked,cate){
				if($location.search().key != undefined){
					$scope.keywords = $location.search().key;
					worksInfo.searchData($scope.keywords,$scope.page)
					.then(function(res){
						$scope.data = res.data;

						//遍历得到要显示的页码
						$scope.data.pageInfo.pageList = [];
						for(var i =$scope.data.pageInfo.PageStart;i<$scope.data.pageInfo.PageEnd+1;i++){
							$scope.data.pageInfo.pageList.push(i);
						}
						$scope.data.pageInfo.pageInput = $scope.data.pageInfo.CurrentPage;

						console.log($scope.data);

						if(watch){
							watch();
						}
						//监控被修改分类的对象
						watch = $scope.$watch('data.view',function(newValue,oldValue,scope){
							if(newValue != oldValue){
								for(var i=0;i<$scope.data.view.length;i++){
									if(newValue[i].worksClass != oldValue[i].worksClass){
										console.log(newValue[i]);
										var x = newValue[i];
										worksInfo.changeClass(x.worksID,x.userView.UserID,x.worksClass)
										.then(function(res){											
											if(res.data.success){
												console.log('修改分类成功');
												errorModal('修改分类成功');
											}else{
												errorModal(res.data.message);
											}
										})
									}
								}
							}
						},true)
					});
					return ;
				}
				
				if(haveChecked==0){
					//加载未处理的数据
					worksInfo.loadData($scope.cate,$scope.page).then(function(res){
						$scope.data = res.data;
						console.log($scope.data);

						//遍历得到要显示的页码
						$scope.data.pageInfo.pageList = [];
						for(var i =$scope.data.pageInfo.PageStart;i<$scope.data.pageInfo.PageEnd+1;i++){
							$scope.data.pageInfo.pageList.push(i);
						}
						$scope.data.pageInfo.pageInput = $scope.data.pageInfo.CurrentPage;

						// console.log($scope.data);

						if(watch){
							watch();
						}
						//监控被修改分类的对象
						watch = $scope.$watch('data.view',function(newValue,oldValue,scope){
							if(newValue != oldValue){
								for(var i=0;i<$scope.data.view.length;i++){
									if(newValue[i].worksClass != oldValue[i].worksClass){
										console.log(newValue[i]);
										var x = newValue[i];
										worksInfo.changeClass(x.worksID,x.userView.UserID,x.worksClass)
										.then(function(res){											
											if(res.data.success){
												console.log('修改分类成功');
												errorModal('修改分类成功');
											}else{
												errorModal(res.data.message);
											}
										})
									}
								}
							}
						},true)
					});
				}else if(haveChecked==1){
					//加载已处理的数据
					worksInfo.loadDisposed($scope.cate,$scope.page,$scope.recommends).then(function(res){
						$scope.data = res.data;

						//遍历得到要显示的页码
						$scope.data.pageInfo.pageList = [];
						for(var i =$scope.data.pageInfo.PageStart;i<$scope.data.pageInfo.PageEnd+1;i++){
							$scope.data.pageInfo.pageList.push(i);
						}
						$scope.data.pageInfo.pageInput = $scope.data.pageInfo.CurrentPage;

						console.log(res.data);

						if(watch){
							watch();
						}
						//监控被修改分类的对象
						watch = $scope.$watch('data.view',function(newValue,oldValue,scope){
							if(newValue != oldValue){
								for(var i=0;i<$scope.data.view.length;i++){
									if(newValue[i].worksClass != oldValue[i].worksClass){
										console.log(newValue[i]);
										var x = newValue[i];
										worksInfo.changeClass(x.worksID,x.userView.UserID,x.worksClass)
										.then(function(res){											
											if(res.data.success){
												console.log('修改分类成功');
												errorModal('修改分类成功');
											}else{
												errorModal(res.data.message);
											}
										})
									}
								}
							}
						},true)	
					});
				}
				
			}

			//检查目前是在 已处理列表 还是 未处理列表,然后加载数据
			function checkWhichThenProcess(){
				var clsName = $('.btns_dispose button').eq(0).attr('class');

				if(clsName == 'sg_btns sgb_selected'){
					processData(0,$scope.cate);
				}else{
					processData(1,$scope.cate);
				}
			}

			//翻页和搜索
			$scope.pageBtn = function(num){
				$scope.page = num;
				checkWhichThenProcess();
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
				checkWhichThenProcess();
			}

			//顶部按分类查看列表
			$scope.clsSelect = function(cate){
				$scope.page = 1;		//页码初始化
				$scope.cate = cate;


				//检查是否为已处理列表
				var clsName = $('.btns_dispose button').eq(0).attr('class');
				if(clsName == 'sg_btns sgb_selected'){
					processData(0,$scope.cate);
				}else{
					processData(1,$scope.cate);
				}
			}


			//页面打开默认加载未处理的数据
			processData(0);
			
			//获取分类信息
			worksInfo.getClass()
			.then(function(res){
				console.log(res.data);
				$scope.clsInfo = res.data;
				$scope.perModule = window.parent.parent.frames["frame_top"].module;
				$timeout(function(){
					$('.select_bar .btn').click(function(){
						$(this).siblings().removeClass('sb_selected');
						$(this).addClass('sb_selected');
					})
				},300)
			});

			
			//未处理按钮
			$scope.noDisposed = function(){
				$scope.page = 1;		//页码初始化
				$scope.dispose = false;

				processData(0,$scope.cate);
			}
			//已处理按钮
			$scope.haveDisposed = function(){
				$scope.page = 1;		//页码初始化
				$scope.dispose = true;

				processData(1,$scope.cate);
			}
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
							arr.push(data.worksID);
							return ;
						}
					})
					// console.log(arr);
					if(arr.length == 0){
						errorModal('请先选择要删除的作品');
						return ;
					}
					$.ajax({
						type:"POST",
						async:true,
						url:"/json/AdminWorks/RemoveRange",
						dataType:"json",
						data:{"data":arr},
						success:function(data){
							// data = JSON.parse(data);
							console.log(data);
							if(data.success){
								checkWhichThenProcess();
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
					worksInfo.remove(obj.worksID,obj.userView.UserID)
					.then(function(res){
						console.log(res.data);
						if(!res.data.success){errorModal(res.data.message);}

						checkWhichThenProcess();
					})
				})
				$('#modal_del .md_cancle').click(function(){
					$('#modal_del').fadeOut();
				})
			}

			//全部,已通过，已推荐至首页  按钮组
			$scope.recommendStatus = function(recommend){
				$scope.recommends = recommend;

				processData(1,$scope.cate);
			}
			
			//通过和推荐
			$scope.recommend = function(obj,status){
				worksInfo.recommend(obj.worksID,obj.userView.UserID,status)
				.then(function(res){
					console.log(res.data);
					if(!res.data.success){errorModal(res.data.message);}					

					checkWhichThenProcess();
				})
			}

			//未通过审核
			$scope.refuse = function(obj){
				worksInfo.refuseCheck(obj.worksID)
				.then(function(res){
					console.log(res.data);
					if(!res.data.success){errorModal(res.data.message);}

					checkWhichThenProcess();
				})
			}

			//错误信息提示的模态框
			function errorModal(mes){
				$('#errorModal span').html(mes);
				$('#errorModal').fadeIn(200,function(){
					setTimeout(function(){
						$('#errorModal').fadeOut(300);
					},1500)
				})
			}
			
		}]);