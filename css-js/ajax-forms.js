document.addEventListener('submit', function(e){
	if(!e.target.classList.contains('ajax-form'))
		return false;
	e.preventDefault();
	let form = e.target;
	let FD = new FormData(form);
	FD.append('_method', form.getAttribute('action'));
	let xhr = new XMLHttpRequest;

	xhr.open('POST', 'ajax.php');
	xhr.onreadystatechange = function(){
		if(xhr.readyState != 4) return;

		if(xhr.status == 200){
			try{
				let data = JSON.parse(xhr.responseText);
				if(data.alert && data.alert.text){
					swal.fire({
						html: data.alert.text,
						icon: data.alert.level
					});
				}
				if(data.goto)
					location.assign(data.goto);
				if(data.index)
					location.assign('./');
				if(data.reload)
					location.reload();
				if(data.clear && data.clear.length){
					for(i=0;i<data.clear.length;i++){
						if(form.querySelector(data.clear[i]))
							form.querySelector(data.clear[i]).value = '';
					}
				}
				if(data.hide && data.hide.length){
					for(i=0;i<data.hide.length;i++){
						if(form.querySelector(data.hide[i]))
							form.querySelector(data.hide[i]).style.display = 'none';
					}
				}
				if(data.newAvatar && document.querySelector('.avatar-mine')){
					avs = document.querySelectorAll('.avatar-mine');
					for(i=0;i<avs.length;i++)
						avs[i].src=data.newAvatar + '?v' + Math.random()
				}
				if(data.closeModal && activeModal)
					activeModal.close();

				if($('.formModalA.closeAfterSubmit'))
					$('.formModalA.closeAfterSubmit').classList.remove("formModalA");

				if(data.prependReply && (form.dataset.container || form.closest('.replies'))){
					let cont = form.dataset.container ? $(form.dataset.container) : form.closest('.replies');
					if(cont.classList.contains("noCrit")){
						cont.classList.remove("noCrit");
						cont.innerHTML = '';
					}
					if(form.querySelector('.votStar'))
						form.querySelector('.votStar').remove();
					let rev = dataToReview(data.prependReply, data.type)
					cont.insertBefore(rev, cont.children[0]);
				}
			} catch(e){
				console.log(e);
				swal.fire({
					title: 'Error',
					text: 'Tuvimos un problema al procesar la solicitud, por favor intenta de nuevo.',
					icon: 'error'
				});
				
			}
		} else {
			console.log("XHR Error", xhr.status, xhr.statusText);
			swal.fire({
				title: 'Error',
				text: 'Tuvimos un problema al procesar la solicitud, por favor intenta de nuevo.',
				icon: 'error'
			});
		}

		toggleInputs(form, false);
		if(typeof grecaptcha !== 'undefined'){
			try{
				for(i=0;;i++)
			    	grecaptcha.reset(i)
			} catch(e){}
		}
	}
	if(form.classList.contains("require-captcha")){
		let invisibleContainer = document.createElement('div');
		document.body.appendChild(invisibleContainer);
		let invisibleCaptcha = grecaptcha.render(invisibleContainer, {
			sitekey: document.querySelector('meta[name="sitekey"]').content,
			size: "invisible",
			callback: function(){
				FD.append('g-recaptcha-response', grecaptcha.getResponse(invisibleCaptcha));
				xhr.send(FD);
				invisibleContainer.remove();
			}
		});
		grecaptcha.execute(invisibleCaptcha);
		
	} else {
		xhr.send(FD);
	}


	toggleInputs(form, true);
	return false;
});

function toggleInputs(form, disabled){
	let els = form.querySelectorAll('input:not([type="date"]):not([type="time"])');
	for(i=0;i<els.length;i++)
		els[i].disabled = disabled;
	els = form.querySelectorAll('button');
	for(i=0;i<els.length;i++)
		els[i].disabled = disabled;
	els = form.querySelectorAll('select');
	for(i=0;i<els.length;i++)
		els[i].disabled = disabled;
	els = form.querySelectorAll('textarea');
	for(i=0;i<els.length;i++)
		els[i].disabled = disabled;
}

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}
