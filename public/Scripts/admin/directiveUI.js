//遍历导航栏，找到跳转的导航栏目，添加选中样式
function navSelected(text){
	var win = window.parent.frames["frameLeft"].document;
	var topWin = window.parent.parent.frames["frame_top"].document;
	$(win).find('.nl_li a').each(function(index,e){
		if($(e).html() == text){
			$(win).find('.nl_Lvone').removeClass('nl_Selected');
			$(win).find('.nl_li').removeClass('nl_liSelected');
			$(win).find('.nl_li2').removeClass('nl_liSelected');
			$(e).parents('.nl_Lvone').addClass('nl_Selected');
			$(e).parent().addClass('nl_liSelected');
			$(topWin).find('#mainTitle').html(text);
		}
	})
	$(win).find('.nl_li2 a').each(function(index,e){
		if($(e).html() == text){
			$(win).find('.nl_Lvone').removeClass('nl_Selected');
			$(win).find('.nl_li').removeClass('nl_liSelected');
			$(win).find('.nl_li2').removeClass('nl_liSelected');
			$(e).parents('.nl_Lvone').addClass('nl_Selected');
			$(e).parent().addClass('nl_liSelected');
			$(topWin).find('#mainTitle').html(text);
		}
	})
}

//打开页面，搜索栏里类别显示对应页面的分类
function searchClass(){
	var win = window.parent.frames["frameLeft"].document;
	var title ;
	$(win).find('.nl_ul li').each(function(index,e){
		if($(e).attr('class') == 'nl_li nl_liSelected' ||$(e).attr('class') == 'nl_li2 nl_liSelected'){
			title = $(e).find('a').html();
			return ;
		}
	})
	if(title == '添加资讯' || title == '资讯列表' || title == '专题列表' ||title == '资讯'){
		$('#searchCate').val(0);
		$('.dropdown').find('.dd_text').text('资讯');
		return ;
	}
	if(title == '添加艺术字体' ||title == '艺术字体列表'){
		$('#searchCate').val(1);
		$('.dropdown').find('.dd_text').text('艺术字体');
		return ;
	}
	if(title == '电脑字体列表'){
		$('#searchCate').val(2);
		$('.dropdown').find('.dd_text').text('电脑字体');
		return ;
	}
	if(title == '作品列表' || title == '已修改作品列表' || title == '作品'){
		$('#searchCate').val(3);
		$('.dropdown').find('.dd_text').text('作品');
		return ;
	}
	if(title == '用户列表' || title == '用户'){
		$('#searchCate').val(4);
		$('.dropdown').find('.dd_text').text('设计师');
		return ;
	}
}

//搜索跳转
function searchBtn(){
	/*所选的类别 cate:
	*	0 资讯列表	/AdminNews/InfoControl
	*	1 艺术字体	/Admin/Works
	*	2 电脑字体	/Admin/UpFont
	*	3 作品列表	/adminTemplate/worksControl/worksList.html
	*	4 用户列表 	/adminTemplateUserControl/userList.html
	*/
	var cate = parseInt($('#searchCate').val());
	var key = $('#search_kw').val();
	var win = window.parent.frames["frameLeft"].document;
	switch (cate){
		case 0:
			if($(win).find('.nl_Selected .nl_tt').html() == '回收站'){
				navSelected('资讯');
				window.location.href = '/adminTemplate/Recycle/news.html?key='+key;
			}else{
				navSelected('资讯列表');
				window.location.href = '/AdminNews/InfoControl?key='+key;
			}
			break;
		case 1:
		console.log('/Admin/Works?key='+key);
			navSelected('艺术字体列表');
			window.location.href = '/Admin/Works?key='+key;
			break;
		case 2:
		console.log('/Admin/UpFont?key='+key);
			navSelected('电脑字体列表');
			window.location.href = '/Admin/UpFont?key='+key;
			break;
		case 3:
			if($(win).find('.nl_Selected .nl_tt').html() == '回收站'){
				navSelected('作品');
				window.location.href = '/adminTemplate/Recycle/works.html?key='+key;
			}else{
				navSelected('作品列表');
				window.location.href = '/adminTemplate/worksControl/worksList.html?key='+key;
			}
			break;
		case 4:
			if($(win).find('.nl_Selected .nl_tt').html() == '回收站'){
				navSelected('用户');
				window.location.href = '/adminTemplate/Recycle/users.html?key='+key;
			}else{
				navSelected('用户列表');
				window.location.href = '/adminTemplate/UserControl/userList.html?key='+key;
			}
			break;
	}
}
//自执行 下拉菜单切换
$(function(){
	//搜索下拉
    $('.dropdown').on('click', 'a', function(){
        var text = $(this).html();
        $(this).parents('.dropdown').find('.dd_text').text(text);
        $('#searchCate').val($(this).attr('tabindex'));	//赋值cate
    })
    //监听回车键
    $('.search_box').keypress(function(e){
    	if(e.which == 13){
    		$('#searchBtn').click();
    		/*if($('#searchBtn')){
    			$('#searchBtn').click();
    		}
    		if($('#searchBtn2')){
    			$('#searchBtn2').click();
    		}*/
    	}
    })
})

angular.module('commonUI',[])
	//搜索栏
	.directive('searchTool',[function(){
		return {
			restrict: 'AE',
			replace: true,
			template: '<div class="search_box">'+
    					'<div class="search_bar">'+
							'<div class="dropdown">'+
					            '<button class="btn btn-default dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown">'+
					                '<i class="vertical_line"></i>'+
					                '<span class="dd_text">资讯</span>'+
					                '<span class="caret"></span>'+
					                '<i class="vertical_line_m"></i>'+
					            '</button>'+
					            '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">'+
					                '<li role="" ng-if="!cp.check(4)"><a role="" tabindex="0" href="#">资讯</a></li>'+
					                '<li role="" ng-if="!cp.check(41)"><a role="" tabindex="1" href="#">电脑字体</a></li>'+
					                '<li role="" ng-if="!cp.check(31)"><a role="" tabindex="2" href="#">艺术字体</a></li>'+
					                '<li role="" ng-if="!cp.check(24)"><a role="" tabindex="3" href="#">作品</a></li>'+
					                '<li role="" ng-if="!cp.check(65)"><a role="" tabindex="4" href="#">设计师</a></li>'+
					            '</ul>'+
					        '</div>'+
					        '<input type="text" class="search_kw" id="search_kw" placeholder="搜索"/>'+
					        '<span class="search_btn_box"><b class="search_btn" id="searchBtn" onClick="searchBtn()"></b></span>'+
					        '<input type="hidden" id="searchCate"value="0" />'+
	    				'</div>'+
					'</div>',
			link:function(scope,elem,attrs){
			
			}
		}
	}])
	//回收站搜索栏
	.directive('recycleSearchTool',[function(){
		return {
			restrict: 'AE',
			replace: true,
			template: '<div class="search_box">'+
    					'<div class="search_bar">'+
							'<div class="dropdown">'+
					            '<button class="btn btn-default dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown">'+
					                '<i class="vertical_line"></i>'+
					                '<span class="dd_text">资讯</span>'+
					                '<span class="caret"></span>'+
					                '<i class="vertical_line_m"></i>'+
					            '</button>'+
					            '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">'+
					                '<li role="" ng-if="!cp.check(4)"><a role="" tabindex="0" href="#">资讯</a></li>'+
					                '<li role="" ng-if="!cp.check(24)"><a role="" tabindex="3" href="#">作品</a></li>'+
					                '<li role="" ng-if="!cp.check(65)"><a role="" tabindex="4" href="#">设计师</a></li>'+
					            '</ul>'+
					        '</div>'+
					        '<input type="text" class="search_kw" id="search_kw" placeholder="搜索"/>'+
					        '<button class="sb_btn" onClick="searchBtn()" style="height:40px;">搜索回收站</button>'+
					        '<input type="hidden" id="searchCate"value="0" />'+
	    				'</div>'+
					'</div>',
			link:function(scope,elem,attrs){
			
			}
		}
	}])
	.directive('worksSelectTool',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="btn-group select_bar">'+
						'<button type="button" class="btn btn-default sb_selected" data-cate="0" ng-click="clsSelect(0)">全部</button>'+
						'<button type="button" class="btn btn-default" data-cate="1" ng-click="clsSelect(1)">平面</button>'+
						'<button type="button" class="btn btn-default" data-cate="2" ng-click="clsSelect(2)">字体</button>'+
					'</div>',
			link: function(scope,elem,attrs){
				$('.select_bar .btn').click(function(){
					$(this).siblings().removeClass('sb_selected');
					$(this).addClass('sb_selected');
				})
			}
		}
	}])
	//作品列表的居中的已处理和未处理按钮
	.directive('selectGroup',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="select_group btns_dispose">'+
						'<button class="sg_btns sgb_selected" ng-click="noDisposed()">未处理</button>'+
						'<button class="sg_btns" ng-click="haveDisposed()">已处理</button>'+
					'</div>',
			link: function(scope,elem,attrs){
				$('.btns_dispose .sg_btns').click(function(){
					$(this).addClass('sgb_selected');
					$(this).siblings().removeClass('sgb_selected');
				})
			}
		}
	}])
	//反馈列表的居左的已处理和未处理按钮
	.directive('feedbackSelectGroup',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="btn-group select_bar">'+
						'<button type="button" class="btn btn-default sb_selected" ng-click="noDisposed(1)">未处理</button>'+
						'<button type="button" class="btn btn-default" ng-click="noDisposed(2)">已处理</button>'+
					'</div>',
			link: function(scope,elem,attrs){
				$('.select_bar .btn').click(function(){
					$(this).siblings().removeClass('sb_selected');
					$(this).addClass('sb_selected');
				})
			}
		}
	}])
	//用户列表的居左的用户类型选项按钮
	.directive('selectGroupNew',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: function(tE,tAttr){
				var html = '',
					text = '';
				var arr = tE.context.dataset.message.split(' ');
				var clickArr = tE.context.dataset.click.split(' ');
				for(var i=0;i<arr.length;i++){
					text += '<button type="button" class="btn btn-default" ng-click="'+
							clickArr[i]+
							'">'+
							arr[i] +
							'</button>'
				}
				html = '<div class="btn-group select_bar '+tAttr.class+'">'+text+'</div>';
				return html;
			},
			link: function(scope,elem,attrs){
				$('.select_bar .btn').eq(0).addClass('sgb_selected');
				$('.select_bar .btn').click(function(){
					$(this).addClass('sgb_selected');
					$(this).siblings().removeClass('sgb_selected');
				})
			}
		}
	}])
	.directive('ctrlGroup',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="ctrl_group">'+
						'<button class="sg_btns" ng-click="selectedAll()">全选</button>'+
						'<button class="sg_btns" ng-click="selectedInvert()">反选</button>'+
						'<button class="sg_btns" ng-click="selectedDel()">删除</button>'+
					'</div>',
			link: function(scope,elem,attrs){

			}
		}
	}])
	//用户列表-全选，反选，冻结，删除
	.directive('ctrlGroupNew',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: function(tE,tAttr){
				var html = '',
					text = '';
				var arr = tE.context.dataset.message.split(' ');
				var clickArr = tE.context.dataset.click.split(' ');
				for(var i=0;i<arr.length;i++){
					text += '<button class="sg_btns" ng-click="'+
							clickArr[i]+
							'">'+
							arr[i] +
							'</button>'
				}
				html = '<div class="select_group ctrl_group '+tAttr.class+'">'+text+'</div>';
				return html;
			},
			link: function(scope,elem,attrs){

			}
		}
	}])
	//作品列表新增 全部、已通过和已推荐至首页 按钮
	.directive('passNew',[function(){
		return {
			restrict: 'E',
			replace: true,
			template: function(tE,tAttr){
				var html = '',
					text = '';
				var arr = tE.context.dataset.message.split(' ');
				var clickArr = tE.context.dataset.click.split(' ');
				for(var i=0;i<arr.length;i++){
					text += '<button class="sg_btns '+(i==0?'active':'')+'" ng-click="'+
							clickArr[i]+
							'">'+
							arr[i] +
							'</button>'
				}
				html = '<div class="'+tAttr.class+'">'+text+'</div>';
				return html;
			},
			link: function(scope,elem,attrs){
				elem.children().click(function(e){
					elem.children().removeClass('active');
					$(this).addClass('active');
				})
			}
		}
	}])
	// 删除模态框
	.directive('modalDelete',[function(){
		return {
			restrict:'E',
			replace:true,
			template:   '<div class="modal_del" id="modal_del">'+
					        '<h4 class="md_title">删除</h4>'+
					        '<div class="md_cont">'+
					            '<span class="md_text">您确定要删除所选中作品吗？您还可以在回收站找回。</span>'+
					            '<div class="md_btns">'+
					                '<button class="md_btn md_sure">确定</button>'+
					                '<button class="md_btn md_cancle">取消</button>'+
					            '</div>'+
					        '</div>'+
					    '</div>',
			link:function(scope,elem,attrs){

			}
		}
	}])
	// 删除模态框-改造
	.directive('modalDelNew',[function(){
		return {
			restrict:'E',
			replace:true,
			template:function(tE,tAttr){
				var html = '';
				html += '<div class="modal_del" id="modal_del">'+
					        '<h4 class="md_title">删除</h4>'+
					        '<div class="md_cont">'+
					            '<span class="md_text">'+
					            tAttr.text +
					            '</span>'+
					            '<div class="md_btns">'+
					                '<button class="md_btn md_sure">确定</button>'+
					                '<button class="md_btn md_cancle">取消</button>'+
					            '</div>'+
					        '</div>'+
					    '</div>';
				return html;
			},
			link:function(scope,elem,attrs){

			}
		}
	}])
	//报错/提示信息弹窗
	.directive('errorModal',[function(){
		return {
			restrict:'E',
			replace:true,
			template:'<div class="errorModal" id="errorModal">'+
						'<span class="errorMessage"></span>'+
					'</div>'
		}
	}])
	.controller('commonCtrl',['$scope',function($scope){
		//权限比对 checkPermission(下为cp)
		$scope.cp = (function(){
			var self;
			var result = false;
			return {
				permission:'',
				//获取用户所有权限，并对比输入的权限名称
				check:function(id){
					if(id == ''||id == undefined){return result;}
					self = this;
		    		self.permission = window.parent.parent.frames["frame_top"].permission;
		    		self.repeat(id);		    		
		    		// console.log('check:'+id+' '+result);
		    		result = !result;
		    		return result;
				},
				//循环比对
				repeat:function(id){
					// console.log($(self.permission));
					$(self.permission).each(function(index,e){
						result=false;
						if(e.permissionID == id){
							result=true;
							return false;
						}
					})
				}
			}
		})()

		//作品列表的分类权限的比对
		$scope.cp2 = function(clsId,per){
			var result = false;
			$(per).each(function(index,e){
				if(clsId == e.moduleID && e.type == 1){
					result = true;
					return false;
				}
			})
			return result;
		}
	}])