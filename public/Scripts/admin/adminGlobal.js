// adminGlobal.js
// console.log(this);
//遍历导航栏，找到跳转的导航栏目，添加选中样式
function navSelected(text){
	var win = window.parent.frames["frameLeft"].document;
	$(win).find('.nl_li a').each(function(index,e){
		if($(e).html() == text){
			$(win).find('.nl_li').removeClass('nl_liSelected');
			$(e).parent().addClass('nl_liSelected');
		}
	})
	$(win).find('.nl_li2 a').each(function(index,e){
		if($(e).html() == text){
			$(win).find('.nl_li2').removeClass('nl_liSelected');
			$(e).parent().addClass('nl_liSelected');
		}
	})
	
}
// 修改顶部标题方法
function topTitle(text) {
      var win = window.parent.parent.frames["frame_top"].document;
      $(win).find('#mainTitle').html(text);
}
// 删除确认弹框
	angular.module('commonDel',[])
	.directive('myDelete',[function(){
		return {
			restrict:'E',
			replace:true,
			template:	function(tElement,tAttrs) {
				var _html = '';
				_html += '<div class="modal-overlay">'+
							'<div class="modal_del" id="modal_del">'+
					    	    '<h4 class="md_title">删除</h4>'+
					    	    '<div class="md_cont">'+
					    	        '<span class="md_text">' + tAttrs.message + '</span>'+
					    	        '<div class="md_btns">'+
					    	            '<button class="md_btn md_sure" ng-click="myDelConfirm()">确定</button>'+
					    	            '<button class="md_btn md_cancle" ng-click="myDelCancel()">取消</button>'+
					    	        '</div>'+
					    	    '</div>'+
					    	'</div>'+
					    '</div>';
					    return _html;
			}
		}
	}])
// 提示弹框
	angular.module('commonTip',[])
	.directive('myAlert',[function(){
		return {
			restrict:'E',
			replace:true,
			template:	function(tElement,tAttrs) {
				var _html = '';
				_html += '<div class="modal-overlay">'+
							'<div class="modal_del" id="modal_del">'+
					    	    // '<h4 class="md_title">删除</h4>'+
					    	    '<div class="md_cont">'+
					    	        '<span class="md_text">' + tAttrs.message + '</span>'+
					    	        '<div class="md_btns">'+
					    	            '<button class="md_btn md_sure" ng-click="myAlertConfirm()">确定</button>'+
					    	            '<button class="md_btn md_cancle" ng-click="myAlertCancel()">取消</button>'+
					    	        '</div>'+
					    	    '</div>'+
					    	'</div>'+
					    '</div>';
					    return _html;
			}
		}
	}])
// 权限比对
	angular.module('checkAccess',[])
	.controller('accessCtrl',['$scope',function($scope){
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
		    		result = ! result;
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
	}])