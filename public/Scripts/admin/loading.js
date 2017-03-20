//loading
function loadingStart(end){
	if(end == 'off'){
		$('.loading').remove();
		$('.submit').removeClass('submitDisabled');
		$('.submit').attr('disabled',false);
		return ;
	}
	$('body').append('<div class="loading">发布中...</div>');
	$('.submit').addClass('submitDisabled');
	$('.submit').attr('disabled',true);
}
