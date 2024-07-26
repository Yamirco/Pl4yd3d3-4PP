var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var ajaxLoading, userSearching, IState, isSearching, searchWait, userSearching, userSearchWait, networkSelecting;
document.addEventListener('click', function(e){
	let T = e.target;

	if(T.dataset.showform || T.closest('[data-showform]')){
		let btn = T.dataset.showform ? T : T.closest('[data-showform]');
		let formname = btn.dataset.showform;
		let oldForm = $('[data-form].active');

		if(!$('[data-form="'+formname+'"]')) return;
		$('[data-form="'+formname+'"]').classList.remove('hiding');
		$('[data-form="'+formname+'"]').classList.add('active');

		if(!oldForm) return;
		oldForm.classList.remove("active");
	}
	if(T.classList.contains('reportLink') || T.closest('.reportLink')){
		let btn = T.classList.contains('reportLink') ? T : T.closest('.reportLink');
		e.stopPropagation();
		e.preventDefault();
		let id = btn.dataset.id;

		if(!$('#reportLinkModal')) return;
		$('#reportLinkModal').classList.add("formModalA");
		$('#reportLinkModal [name="id"]').value = id;
		return;
	}


	if($('.head-main-nav.mobile.active') && !T.classList.contains('head-main-nav') && !T.closest('.head-main-nav')){
		e.stopPropagation();
		e.preventDefault();
		$('.head-main-nav.mobile.active').classList.remove('active');
		return false;
	}
	if((T.href || T.closest('[href]')) && !$('#LOG-REG') && !T.closest('.pagPlaydede') && !T.dataset.force && (!T.target || T.target != '_BLANK') ){

		if(T.classList.contains("avoidLinking") || T.closest("avoidLinking")){
			e.preventDefault();
		} else {
			btn = T.href ? T : T.closest('[href]');
			let current = location.protocol + '//' + location.host;
			let regex = new RegExp('^' + current);
			if(regex.test(btn.href)){
				goto = btn.href;
				e.preventDefault();
				if($('.cargaAjax').classList.contains('CA_Active')) return false;
				$('.cargaAjax').classList.add('CA_Active');
				let FD = new FormData;
				FD.append('_method', 'async');
				FD.append('url', goto);
				fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
					if(data.pushLocation && window.history.state && typeof window.history.state.fullBody != 'undefined'){
						let curr = window.history.state;
						curr.fullBody = $('#main-wrapper .container').innerHTML;
						window.history.replaceState(curr, document.title);
					}
					if(data.body){
						$('#main-wrapper .container').innerHTML = data.body;
						document.scrollingElement.scrollTop = 0;
					}
					if(data.newSlug || data.newSlug=='') window.infoObj.slug = data.newSlug;
					if(data.pushLocation){
						if(data.pushLocation[ data.pushLocation.length -1 ] != '/')
							data.pushLocation += '/';
						history.pushState({'fullBody': $('#main-wrapper .container').innerHTML, slug: data.newSlug, bodyClasses: (data.bodyClasses ? data.bodyClasses.join(" ") : "")}, document.title, data.pushLocation);
					}
					if(data.goto){
						location.assign(data.goto);
					}
					if(typeof data.bodyClasses != 'undefined')
						document.body.className = data.bodyClasses.join(" ");
					afterRender();
				}).catch(function(e){
					console.log(e);
					swal.fire({
						title: 'Error',
						text: 'Tuvimos un problema al procesar la solicitud, por favor intenta de nuevo.',
						icon: 'error'
					});	

				}).finally(function(){
					$('.cargaAjax').classList.remove('CA_Active');
				});
				return false;
			}
		}
	}

	if((T.id=='createList' || T.closest('#createList')) && $('#myList.createList')){
		$('#myList.createList').classList.add('myListA');
	}

	if(T.classList.contains('closeList') || T.closest('.closeList')){
		let btn = T.classList.contains('closeList') ? T : T.closest('.closeList');
		if(btn.closest('#myList'))
			btn.closest('#myList').classList.remove('myListA');
		if(btn.closest('#boxSettPr'))
			btn.closest('#boxSettPr').classList.remove('boxSettPrA');
		if(btn.closest('#boxImport'))
			btn.closest('#boxImport').classList.remove('boxImportA');
		if(btn.closest('.formModalA'))
			btn.closest('.formModalA').classList.remove('formModalA');
	}
	if((T.classList.contains('closeTrailer') || T.closest('.closeTrailer')) && $('#trailerModal')){
		$('#trailerModal').classList.remove('trailerModalA');
		$$('#trailerModal iframe').forEach(function(singleYTIframe){
			singleYTIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
		});
	}
	if((T.classList.contains('res-nav') || T.closest('.res-nav')) && !$('.head-main-nav.mobile.active')){
		$('.head-main-nav.mobile').classList.add('active');
	}
	else if($('.head-main-nav.mobile.active')){
		$('.head-main-nav.mobile.active').classList.remove('active');
		if(!T.classList.contains('head-main-nav') && !T.closest('.head-main-nav.mobile')){
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}

	if((T.classList.contains('open-button-form') || T.closest('.open-button-form')) && !$('.headitems.register_active.active'))
		$('.headitems.register_active').classList.add('active');
	if(T.classList.contains('closeSearch'))
		$('.headitems.register_active').classList.remove('active');

	if((T.classList.contains('vote') || T.closest('.vote')) && T.closest('.puntCri') && !T.closest("[data-linkvote]")){
		let btn = T.classList.contains('vote') ? T : T.closest('.vote');
		let type = btn.dataset.type;
		let id = btn.closest(".itemCrit").dataset.id;
		let container = btn.closest("div");
		container.querySelectorAll('.voteDones').forEach(function(el){el.classList.remove('voteDones')});
		let loader = document.createElement('div');
		loader.classList.add('loadIconV');
		loader.innerHTML = '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform></path></svg>';
		container.insertBefore(loader, container.firstElementChild);
		let FD = new FormData;
		FD.append('_method', 'review/vote');
		FD.append('id', id);
		FD.append('type', type);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
			if(data.vote > 0)
				container.querySelector('.vote[data-type="up"]').classList.add('voteDones');
			else if(data.vote < 0)
				container.querySelector('.vote[data-type="down"]').classList.add('voteDones');
			if(data.count)
				container.closest('.itemCrit').querySelector('.tolVot').innerText = data.count;
			if(container.querySelector('.loadIconV'))
				container.querySelector('.loadIconV').remove();
		});
	}
	if((T.classList.contains('markEpisode') || T.closest('.markEpisode'))){
		let btn = T.classList.contains('markEpisode') ? T : T.closest('.markEpisode');
		let icon = btn.querySelector('i');
		if(btn.disabled) return;
		let id = btn.dataset.id;
		btn.disabled = true;
		icon.classList.add('loading');
		icon.innerHTML = 'cached';
		let FD = new FormData;
		FD.append('_method', 'episode/mark');
		FD.append('id', id);
		fetch('ajax.php', {method: 'POST', body: FD}).then(res => res.json()).then(function(data){
			btn.disabled = false;
			btn.innerHTML = data.marked ? '<i class="material-icons">visibility</i> Visto' : '<i class="material-icons">visibility_off</i> No visto';
		});
	}
	if((T.classList.contains('markSeason') || T.closest('.markSeason'))){
		let btn = T.classList.contains('markSeason') ? T : T.closest('.markSeason');
		let icon = btn.querySelector('i');
		if(btn.disabled) return;
		let id = btn.dataset.id;
		let season = btn.dataset.season;
		btn.disabled = true;
		icon.classList.add('loading');
		icon.innerHTML = 'cached';
		let FD = new FormData;
		FD.append('_method', 'season/mark');
		FD.append('id', id);
		FD.append('season', season);
		fetch('ajax.php', {method: 'POST', body: FD}).then(res => res.json()).then(function(data){
			btn.disabled = false;
			btn.innerHTML = data.marked ? '<i class="material-icons">visibility</i> Vista' : '<i class="material-icons">visibility_off</i> No vista';
			$$('[data-eseason="'+season+'"]').forEach(function(singleEpisodeMarker){
				singleEpisodeMarker.innerHTML = data.marked ? '<i class="material-icons">visibility</i> Visto' : '<i class="material-icons">visibility_off</i> No visto';
			})
		});
	}
	if((T.classList.contains('manage-friend') || T.closest('.manage-friend'))){
		let btn = T.classList.contains('manage-friend') ? T : T.closest('.manage-friend');
		if(btn.disabled) return;
		btn.disabled = true;
		let user_id = btn.dataset.user;
		let action = btn.dataset.do;
		FD = new FormData;
		FD.append('_method', 'user/friend');
		FD.append('user_id', user_id);
		FD.append('do', action);
		fetch('ajax.php', {method:'POST', body:FD}).then(res => res.json()).then(function(data){
			if(data.button){
				$$('.manage-friend[data-user="'+user_id+'"]').forEach(B => { if(B==btn){return} B.remove() });
				btn.outerHTML = data.button;
			}
		});
	}
	if(T.classList.contains('trailer') || T.closest('.trailer')){
		if($('#trailerModal')) $('#trailerModal').classList.add('trailerModalA');
	}
	if(T.classList.contains('manage_post') || T.closest('.manage_post')){
		if($('#manage_post')){
			$('#manage_post').style.display = $('#manage_post').style.display=='none' ? '' : 'none';
		}
	}
	if(T.dataset.repcrit || T.closest('[data-repcrit]')){
		let btn = T.dataset.repcrit ? T : T.closest('[data-repcrit]');
		let id = btn.dataset.repcrit;
		if(!$('#reportReviewModal')) return;
		$('#reportReviewModal').classList.add('formModalA');
		$('#reportReviewModal [name="id"]').value = id;
	}
	if(T.dataset.delcrit || T.closest('[data-delcrit]')){
		let btn = T.dataset.delcrit ? T : T.closest('[data-delcrit]');
		let id = btn.dataset.delcrit;
		swal.fire({
			title: '¿Deseas eliminar tu comentario?',
			showDenyButton: true,
			denyButtonText: 'Sí, eliminar',
			confirmButtonText: 'No'
		}).then(function(resp){
			if(resp.isDismissed || resp.isConfirmed) return;
			let FD = new FormData;
			FD.append('_method', 'review/delete');
			FD.append('id', id);
			fetch('ajax.php', {method: 'POST', body: FD}).then(res => res.json()).then(function(data){
				if(data.alert){
					swal.fire({
						text: data.alert.text,
						icon: data.alert.level
					});
				}
				if(data.success){
					btn.closest('.itemCrit').remove();
				}
			})
		});
	}
	if(T.closest('.navSectionPerfil') && (T.nodeName=='A' || T.closest('a'))){
		btn = T.nodeName=='A'  ? T : T.closest('a');
		let ajaxName = btn.closest('nav').dataset.ajax;
		let username = btn.closest('nav').dataset.user;
		let type = btn.dataset.type;
		let subtype = btn.dataset.subtype;
		if(!ajaxLoader(ajaxName, {type: type, subtype: subtype, username: username, 'async': true})) return;
		$$('.nsecPerA').forEach(function(i){ i.classList.remove('nsecPerA') });
		btn.classList.add('nsecPerA');
	}
	if(T.classList.contains('verifyLinks') || T.closest('.verifyLinks')){
		let btn = T.classList.contains('verifyLinks') ? T : T.closest('.verifyLinks');
		if(btn.classList.contains("isChecking"))
			return;
		let post_id = btn.dataset.id;
		let episode_id = btn.dataset.episode || 0;
		btn.classList.add("isChecking");
		let FD = new FormData;
		FD.append('_method', 'link/check');
		FD.append('post_id', post_id);
		if(episode_id) FD.append('episode_id', episode_id);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
			if(data.reload)
				location.reload();
			else
				btn.classList.remove("isChecking");
			if(data.alert && data.alert.text){
				swal.fire({
					text: data.alert.text,
					icon: data.alert.level
				});
			}
		});
	}
	if(T.classList.contains('reimport') || T.closest('.reimport')){
		let btn = T.classList.contains('reimport') ? T : T.closest('.reimport');
		let top = btn.closest('[data-id]');
		if(!top || !top.dataset.id) return;
		let post_id = top.dataset.id;
		if(btn.classList.contains('isChecking')) return;
		btn.classList.add('isChecking');
		let FD = new FormData;
		FD.append('_method', 'post/reimport');
		FD.append('post_id', post_id);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
			if(data.alert && data.alert.text){
				swal.fire({
					text: data.alert.text,
					icon: data.alert.level
				});
			}
			if(data.reload){
				location.reload();
			} else {
				btn.classList.remove('isChecking');
			}
		});
	}
	if(T.classList.contains('postToList') || T.closest('.postToList')){
		let btn = T.classList.contains('postToList') ? T : T.closest('.postToList');
		if(btn.classList.contains('adding')) return;
		btn.classList.add('adding');
		let method = btn.classList.contains('added') ? 'removePost' : 'addPost';
		let FD = new FormData;
		FD.append('_method', 'list/' + method);
		FD.append('id', btn.dataset.id);
		FD.append('post', btn.dataset.post);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
			btn.classList.remove('adding');
			if(btn.classList.contains('added')){
				btn.classList.remove('added');
				btn.innerText = 'Añadir';
			} else {
				btn.classList.add('added');
				btn.innerText = 'Añadido';
			}
		});
	}
	if(T.id=='addLink' || T.closest('#addLink')){
		if($('.linkModal')) $('.linkModal').classList.add('myListA');
	}

	if(T.dataset.dellist || T.closest('[data-dellist]')){
		let btn = T.dataset.dellist ? T : T.closest['data-dellist'];
		let id = btn.dataset.dellist;
		Swal.fire({
			title: '¿Seguro?...',
			text: '¿Estás seguro de que deseas eliminar esta lista? esta acción es irreversible',
			showDenyButton: true,
			confirmButtonText: 'No, conservar',
			denyButtonText: 'Sí, eliminar'
		}).then(function(response){
			if(!response.isDenied) return;
			let FD = new FormData;
			FD.append('_method', 'list/remove');
			FD.append('id', id);
			fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
				if(data.goto)
					window.location.assign(data.goto);
				else{
					window.location.reload();
				}
			});
		})
	}

	if(T.dataset.star || T.closest('[data-star]')){
		let btn = T.dataset.star ? T : T.closest('[data-star]');
		$('[name="stars"]').value = btn.dataset.star;
		$$('[data-star]').forEach(function(single){
			if(single.dataset.star > btn.dataset.star){
				single.innerHTML = 'star_border';
				single.classList.remove('stOn');
			} else {
				single.innerHTML = 'star';
				single.classList.add('stOn');
			}
		})
	}


	if((T.classList.contains('spoiler') || T.closest('.spoiler')) && T.closest('.cuerCri')){
		let btn = T.classList.contains('spoiler') ? T : T.closest('.spoiler');
		Swal.fire({
			title: 'Ver spoiler',
			text: '¿Seguro que deseas leer este spoiler?',
			showDenyButton: true,
			reverseButtons: true,
			denyButtonText: 'No, cancelar',
			confirmButtonText: 'Sí, mostrar'
		}).then(function(result){
			if(!result.isConfirmed) return;
			btn.classList.remove('spoiler');
			btn.onclick = function(){};
		});
	}
	if((T.dataset.lang && T.nodeName == 'IMG') || T.closest('img[data-lang]')){
		let btn = T.dataset.lang ? T : T.closest('img[data-lang]')
		$$('.playerItem[data-lang]').forEach(function(i){ i.classList.remove('active') });
		$$('.playerItem[data-lang="'+btn.dataset.lang+'"]').forEach(function(i){ i.classList.add('active') });
		$$('img[data-lang]').forEach(function(i){ i.classList.remove('active') });
		btn.classList.add('active');	
	}
	if(T.classList.contains('clickSeason') || T.closest('.clickSeason')){
		let btn = T.classList.contains('clickSeason') ? T : T.closest('.clickSeason');
		let S = btn.dataset.season;
		$$('.clickSeason').forEach(function(i){ i.classList.remove('clickAc') });
		btn.classList.add('clickAc');
		$$('.se-c').forEach(function(i){ i.style.display = 'none' });
		$('.se-c[data-season="'+S+'"]').style.display = 'block';
	}
	if(T.dataset.linkvote || T.closest("[data-linkvote]")){
		e.stopPropagation();
		e.preventDefault();
		if(T.dataset.type || T.closest("[data-type]")){
			let container = T.closest("[data-linkvote]");
			let btn = T.dataset.type ? T : T.closest("[data-type]");
			let type = btn.dataset.type;
			let id = container.dataset.linkvote;

			container.querySelectorAll('.voteDones').forEach(function(el){el.classList.remove('voteDones')});
			let loader = document.createElement('div');
			loader.classList.add('loadIconV');
			loader.innerHTML = '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform></path></svg>';
			container.querySelector('div').insertBefore(loader, container.querySelector('div').firstElementChild);
			let FD = new FormData;
			FD.append('_method', 'link/vote');
			FD.append('id', id);
			FD.append('type', type);
			fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
				if(data.vote > 0)
					container.querySelector('.vote[data-type="up"]').classList.add('voteDones');
				else if(data.vote < 0)
					container.querySelector('.vote[data-type="down"]').classList.add('voteDones');
				if(data.count)
					container.querySelector('.tolVot').innerText = data.count;
				if(container.querySelector('.loadIconV'))
					container.querySelector('.loadIconV').remove();
			});
		}
		return false;
	}
	if(T.dataset.loadplayer || T.closest('[data-loadplayer]')){
		btn = T.dataset.loadplayer ? T : T.closest('[data-loadplayer]');
		if(e.target.classList.contains("moderateLink") ||  T.closest("[data-linkvote]") || T.dataset.linkvote) return;
		e.preventDefault();
		$('.playerSelector .container').style.display = 'none';
		$('.playerSelector .loadedPlayer').style.display = 'block';
		$('.loadedPlayer .innerPlayer').innerHTML = '<div class="loadingvideo"><span></span></div>';

		activePlayer = btn.dataset.loadplayer;
		FD = new FormData;
		FD.append('_method', 'getPlayer');
		FD.append('id', activePlayer);
		FD.append('width', ($('.playerSelector').offsetWidth - 50));
		FD.append('height', $('.playerSelector').offsetHeight);

		fetch('ajax.php',{method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
			if(data.render){
				$('.loadedPlayer .innerPlayer').innerHTML = data.render;
			} else if(data.goto){
				window.open(data.goto);
				$('.playerSelector .container').style.display = 'block';
				$('.playerSelector .loadedPlayer').style.display = 'none';
			} else {
				swal.fire({
					text: 'Error desconocido.',
					icon: 'warning'
				});
				$('.playerSelector .container').style.display = 'block';
				$('.playerSelector .loadedPlayer').style.display = 'none';
			}
		});
		return false;
	}


	if(T.classList.contains('playerBack') || T.closest('.playerBack')){
		let btn = T.classList.contains('playerBack') ? T : T.closest('.playerBack');
		$('.playerSelector .container').style.display = 'block';
		$('.playerSelector .loadedPlayer').style.display = 'none';
		$('.loadedPlayer .innerPlayer').innerHTML = '';
	}

	if(T.classList.contains('marcado') || T.closest('.marcado')){
		let btn = T.classList.contains('marcado') ? T : T.closest('.marcado');
		let selector = btn.querySelector('.ma-op');
		let span = btn.querySelectorAll('span')[0];
		let count = $$('.ma-op li').length;
		if(span.classList.contains('marcado-A')){
			selector.classList.remove('ma-op-A');
			span.classList.remove('marcado-A');
		} else {
			selector.classList.add('ma-op-A');
			span.classList.add('marcado-A');
		}
	}


	if(T.closest('.ma-op') && (T.dataset.type || T.closest('[data-type]'))){
		let btn = T.dataset.type ? T : T.closest('[data-type]');
		let op = btn.dataset.type;
		let id = btn.closest('.ma-op').dataset.id;
		let span = btn.closest('.marcado').querySelectorAll('span')[0];
		let old = span.innerHTML;
		let possible = btn.innerHTML;
		if(op=='canc')
			possible = '<i class="material-icons">keyboard_arrow_down</i> Marcar como';
		span.innerHTML = '<div class="loadSVGC"><svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform></path></svg></div>';
		let FD = new FormData;
		FD.append('_method', 'mark');
		FD.append('post', id);
		FD.append('type', op);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
			span.innerHTML = data.success ? possible : old;
			let icon = span.querySelector('.material-icons');
			if(icon && icon.innerHTML != 'keyboard_arrow_down' && !span.classList.contains('marcado-B')){
				span.classList.add('marcado-B');
			} else if(icon.innerHTML == 'keyboard_arrow_down' && span.classList.contains('marcado-B')){
				span.classList.remove('marcado-B');
			}
		});
	}


	if(T.classList.contains('settPrfl') || T.closest('.settPrfl')){
		let btn = T.classList.contains('settPrfl') ? T : T.closest('.settPrfl');
		if(btn.classList.contains('imp') && $('#boxImport')){
			$('#boxImport').classList.add('boxImportA');
		} else if(btn.classList.contains('adm')){
			return;
		} else if($('#boxSettPr')) {
			$('#boxSettPr').classList.add('boxSettPrA');
		}
	}

	if(T.classList.contains('addtoList') || T.closest('.addtoList')){
		if($('#myList:not(.linkModal)'))
			$('#myList:not(.linkModal)').classList.add('myListA');
	}


	if(T.classList.contains('lc-nav') || T.closest('.lc-nav')){
		let btn = T.classList.contains('lc-nav') ? T : T.closest('.lc-nav');
		let type = btn.dataset.type;
		$('.lc-nav.nav-A').classList.remove('nav-A');
		btn.classList.add('nav-A');
		$$('.sbox').forEach(function(box){ box.style.display='none'});
		$('#comments').style.display = 'none';
		switch(type){
			case "info":
				$$('.sbox').forEach(function(box){ box.style.display='block'});
			break;
			case "comments":
				$('#comments').style.display = 'block';
			break;
		}
	}

	if(T.classList.contains('favList') || T.closest('.favList')){
		let btn = T.classList.contains('favList') ? T : T.closest('.favList');
		let fav = btn.classList.contains('favListA') ? 0 : 1;
		FD = new FormData;
		FD.append('_method', 'list/favorite');
		FD.append('list', btn.dataset.id);
		FD.append('fav', fav);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.text()}).then(function(data){});
		if(!fav){
			btn.classList.remove('favListA');
			btn.querySelector('.material-icons').innerHTML = 'favorite_border';
		} else {
			btn.classList.add('favListA');
			btn.querySelector('.material-icons').innerHTML = 'favorite';
		}
	}

	if(T.classList.contains('navri') || T.closest('.navri')){
		let btn = T.classList.contains('navri') ? T : T.closest('.navri');
		let type = btn.dataset.type;
		let ajaxName = btn.closest("nav").dataset.ajax;
		if(!ajaxLoader(ajaxName, {'type': type, 'async': true})) return;
		$$('.navri.nav-A').forEach(function(i){ i.classList.remove('nav-A') });
		btn.classList.add('nav-A');
	}


	if(T.dataset.setslug || T.closest('[data-setslug]')){
		let btn = T.dataset.setslug ? T : T.closest('[data-setslug]');
		e.preventDefault();
		let ajaxName = 'main';
		let slug  = btn.dataset.setslug;
		window.infoObj.slug = slug;
		ajaxLoader(ajaxName);
		btn.closest('nav').querySelectorAll('.nav-A').forEach(function(i){ i.classList.remove('nav-A') });
		btn.classList.add('nav-A');	
	}

	if(T.classList.contains('editList') || T.closest('.editList')){
		$('#myList').classList.add('myListA');
	}



	if(T.closest('nav') && (T.classList.contains('filter') || T.closest('.filter'))){
		let btn = T.classList.contains('filter') ? T : T.closest('.filter');
		let target = 'filterInsert';
		if(btn.classList.contains("letter")) target = 'filterLetter';
		if(btn.classList.contains("link")) target = 'filterLink';
		if(!$('#' + target)) return;
		if(btn.classList.contains('nav-A')){
			btn.classList.remove('nav-A');
			$('#' + target).classList.remove(target + 'A');
		} else {
			btn.classList.add('nav-A');
			$('#' + target).classList.add(target + 'A');
		}
	}

	if(T.classList.contains('cfilter') || T.closest('.cfilter')){
		let btn = T.classList.contains('cfilter') ? T : T.closest('.cfilter');
		btn.classList.toggle("filterON");
		countFilters();	
	}
	if(T.id=='filtrar' || T.closest('#filtrar')){
		let filters = {
			genre: [],
			year: []
		};
		$$('.filterON').forEach(function(el){
			if(el.dataset.type)
				filters[el.dataset.type].push(el.dataset.value);
		});
		if($('#cfilterYear.filterON')){
			filters.year.push($('#cfilterYear.filterON').value);
		}
		let string = Object.entries(filters).map(function(single){ return single[1].length ? single[0]+'='+single[1].join(",") : '' });
		let searchParams = new URLSearchParams(window.location.search);
		if(searchParams.has("lang")) string.push('lang=' + searchParams.get("lang"));
		if(searchParams.has("qlt")) string.push('qlt=' + searchParams.get("qlt"));
		if(searchParams.has("letter")) string.push('letter=' + searchParams.get("letter"));
		string = string.filter(str => str.length>0).join("&");
		window.location.href =  $('#filterInsert').dataset.mainslug + '?' + string;
	}
	if(T.id=='filterLinkBtn' || T.closest('#filterLinkBtn')){
		let filters = {
			lang: [],
			qlt: []
		};
		$$('#filterLink input[type="checkbox"]').forEach(function(el){
			if(el.dataset.type && el.checked)
				filters[el.dataset.type].push(el.value);
		});

		let string = Object.entries(filters).map(function(single){ return single[1].length ? single[0]+'='+single[1].join(",") : '' });
		let searchParams = new URLSearchParams(window.location.search);
		if(searchParams.has("year")) string.push('year=' + searchParams.get("year"));
		if(searchParams.has("genre")) string.push('genre=' + searchParams.get("genre"));
		if(searchParams.has("letter")) string.push('letter=' + searchParams.get("letter"));
		string = string.filter(str => str.length>0).join("&");
		window.location.href =  $('#filterInsert').dataset.mainslug + '?' + string;
	}

	if(T.closest('.navEP2') && (T.dataset.section || T.closest('[data-section]'))){
		let btn = T.dataset.section ? T : T.closest('[data-section]');
		btn.closest('.navEP2').querySelectorAll('.act_N').forEach(function(i){ i.classList.remove('act_N')});
		btn.classList.add('act_N');
		let section = btn.dataset.section;
		$('.contEP_A').classList.remove('contEP_A');
		$('.contepID_'+section).classList.add('contEP_A');
	}
	if(T.classList.contains('single-network') || T.closest('.single-network')){
		if(networkSelecting) window.clearTimeout(networkSelecting);
		let btn = T.classList.contains('single-network') ? T : T.closest('.single-network');
		btn.classList.toggle('active');
		networkSelecting = setTimeout(function(){
			$('.module[data-ajax="main"]').innerHTML = '';
			ajaxLoader('main', {page: 1});
		}, 500);
	}
	if(T.classList.contains('poster-mark') || T.closest('.poster-mark')){
		let btn = T.classList.contains('poster-mark') ? T : T.closest('.poster-mark');
		e.stopPropagation();
		e.preventDefault();
		let id = btn.dataset.id;
		let type = btn.dataset.type;
		let premiered = btn.dataset.premiered;
		let items = [];
		if(premiered == 1){
			if(type=='serie' || type=='anime')
				items.push('<li data-type="sig"><i class="material-icons">remove_red_eye</i> Siguiendo</li>')
			items.push('<li data-type="fav"><i class="material-icons">favorite</i> Favoritos</li>');
		}
		items.push('<li data-type="pend"><i class="material-icons">access_time</i> Pendiente</li>');
		if(premiered == 1){
			items.push('<li data-type="vis"><i class="material-icons">visibility_off</i> Vista</li>');
		}
		items.push('<li data-type="canc"><i class="material-icons">close</i> Cancelar</li>');

		let list = document.createElement('div');
		list.className = 'poster-mark-list';
		list.dataset.post = id;
		list.innerHTML = items.join('');
		btn.closest('.item').insertBefore(list, btn);
		return false;
	}
	if(T.closest('.poster-mark-list') && (T.dataset.type || T.closest('[data-type]'))){
		let btn = T.dataset.type ? T : T.closest('[data-type]');
		let icon = btn.querySelector('.material-icons').innerText;
		let newIcon = icon=='close' ? 'more_vert' : icon;
		let type = btn.dataset.type;
		let id = btn.closest('.poster-mark-list').dataset.post;
		document.querySelector('.poster-mark[data-id="'+id+'"] i.material-icons').innerText = newIcon;
		let FD = new FormData;
		FD.append('_method', 'mark');
		FD.append('post', id);
		FD.append('type', type);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){});
		btn.closest('.poster-mark-list').remove();

		Swal.fire(
			{
				title: 'Post marcado',
				toast: true,
				showConfirmButton: false,
				timer: 1000,
				customClass: {
					popup: 'success-toast'
				}
			}
		)
	}
	if( (T.id == 'requestContent' || T.closest('#requestContent')) && $('#requestModal')){
		$('#requestModal').classList.add('formModalA');
	}
	if(T.closest('.reviews-filters') && (T.dataset.filter || T.closest("[data-filter]"))){
		let btn = T.dataset.filter ? T : T.closest("[data-filter]");
		let sibling = btn.closest('.reviews-filters').nextElementSibling;
		if(!sibling.classList.contains("load-comments")) return;
		if(!sibling.dataset.post && !sibling.dataset.episode && !sibling.dataset.user) return;
		if(sibling.classList.contains("isLoading")) return;
		btn.closest('.reviews-filters').querySelectorAll('[data-filter]').forEach(function(el){
			el.classList.remove("active");
		});
		btn.classList.add("active");
		sibling.dataset.page = 0;
		sibling.dataset.filter = btn.dataset.filter;
		sibling.innerHTML = '';
		let ref = sibling.dataset.post || sibling.dataset.episode || sibling.dataset.user;
		let type = sibling.dataset.post ? 'post' : (sibling.dataset.episode ? 'episode' : 'user');
		console.log(ref, type);
		loadComments(sibling, type, ref);
	}
	if(T.classList.contains("removeAlert") || T.closest(".removeAlert")){
		let btn = T.classList.contains("removeAlert") ? T : T.closest(".removeAlert");
		let container = btn.closest(".userAlert");
		container.classList.add("isHiding");
		setTimeout(function(){
			container.remove();
		}, 500);
		let FD = new FormData;
		FD.append('_method', 'notifications/remove');
		FD.append('id', btn.dataset.id);
		fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){});
	}
});
document.addEventListener('change', function(e){
	T = e.target;
	if(T.classList.contains('calendar-select')){
		loadCalendar();
		$$('.calendar-select').forEach(el => el.disabled = true);
	}
	if(T.dataset.linkfilter){
		let container = T.closest('.linksUsers');
		if(!container) return;
		let quality = container.querySelector('[data-linkfilter="quality"]') ? container.querySelector('[data-linkfilter="quality"]').value : 0;
		let lang = container.querySelector('[data-linkfilter="lang"]') ? container.querySelector('[data-linkfilter="lang"]').value : 0;
		let provider = container.querySelector('[data-linkfilter="provider"]') ? container.querySelector('[data-linkfilter="provider"]').value : 0;
		let votes = container.querySelector('[data-linkfilter="votes"]') ? container.querySelector('[data-linkfilter="votes"]').value : 0;
		container.querySelectorAll('li').forEach(function(link){ link.style.display = 'none'; });
		let sel = 'li';
		if(quality) sel+='[data-quality="'+quality+'"]';
		if(lang) sel+='[data-lang="'+lang+'"]';
		if(provider) sel+='[data-provider="'+provider+'"]';
		container.querySelectorAll(sel).forEach(function(link){
			link.style.display = '';
			let count = parseInt(link.querySelector('.tolVot').innerText);
			if(votes == 'ASC'){
				link.style.order = count * -1;
			} else if(votes == 'DESC'){
				link.style.order = count;
			} else {
				link.style.order = 0;
			}
		});

	}
});
document.addEventListener('DOMContentLoaded', function(){
	if(window.location.pathname == '/ready/'){
		window.close();
	}
	if($('.no-script')){
		$('.no-script').remove();
	}
	window.history.pushState(initialState(), document.title, window.location.pathname+window.location.search);
	afterRender();

	if($('.viewNot')){
		$('.viewNot').onclick = function(e){
			$('#notifBox').classList.add('notifBoxA');

			let FD = new FormData;
			FD.append('_method', 'notifications/viewed');
			fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
				if(data.success && $('.notCount'))
					$('.notCount').remove();
			});

			e.preventDefault();
			return false;
		}
		$('#notifBox .closeList').onclick = function(){
			$('#notifBox').classList.remove('notifBoxA');
		}
	}

	if($('[name="s"]')){
		$('[name="s"]').onblur = function(){
			setTimeout(function(){
				$('.live-search').style.display = 'none';
			}, 250);
		}
		$('[name="s"]').onfocus = function(){
			$('.live-search').style.display = '';
		}
		$('[name="s"]').onkeydown = function(){
			if(searchWait) window.clearInterval(searchWait);
			searchWait = setTimeout(doSearch, 300);
		}
		function doSearch(){
			if(isSearching) isSearching.abort();
			isSearching = new AbortController();
			$('.live-search').innerHTML = '<ul><li style="padding-bottom:10px"><div class="loadingvideo"><span></span></div></li></ul>';
			let FD = new FormData;
			FD.append('_method', 'search');
			FD.append('query', $('[name="s"]').value);
			fetch('ajax.php', {method: 'POST', body: FD, signal: isSearching.signal}).then(function(res){return res.json()}).then(function(data){
				$('.live-search').innerHTML = '';
				if(!data.results || !data.results.length) return;
				$('.live-search').innerHTML = '<ul></ul>';
				data.results.forEach(function(singleResult){
					let item = document.createElement('li');
					let anchor = document.createElement('a');
					anchor.href = singleResult.link;
					anchor.classList.add('clearfix');
					item.appendChild(anchor);

					let poster = document.createElement('div');
					poster.classList.add('poster');
					poster.innerHTML = '<img src="'+singleResult.poster+'"/>';
					anchor.appendChild(poster);

					let title = document.createElement('div');
					title.classList.add('title');
					title.innerText = singleResult.title;
					anchor.appendChild(title);

					let type = document.createElement('div');
					type.classList.add('type');
					type.innerText = singleResult.type;
					anchor.appendChild(type);

					$('.live-search ul').appendChild(item);
				});
				let allResults = document.createElement('li');
				allResults.classList.add('ctsx');
				allResults.innerHTML = '<a class="more live_search_click">Ver todos los resultados</a>';
				allResults.onclick = function(){ $('#searchform').submit() };
				$('.live-search ul').appendChild(allResults);
			});
		}
	}
	if($('.light-switch')){
		$('.light-switch').onclick = function(){
			let isLight = this.querySelector('i.material-icons').innerText == 'light_mode' ? false : true;
			if(isLight){
				this.querySelector('i.material-icons').innerText = 'light_mode';
				document.body.classList.remove('light-theme');
				document.cookie = "light=0;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";
			} else {
				this.querySelector('i.material-icons').innerText = 'dark_mode';
				document.body.classList.add('light-theme');
				document.cookie = "light=1;path=/";
			}
		}
	}
	if($('#cfilterYear')){
		$('#cfilterYear').onkeyup = function(){
			(this.value.length) ? this.classList.add('filterON') : this.classList.remove('filterON');
			countFilters();
		}
	}
});
function doUserSearch(){
	if(userSearching) userSearching.abort();
	userSearching = new AbortController();
	if(!$('.user-search .results'))
		return;

	$('.user-search .results').innerHTML = '<a class="single-result isLoading"><div class="loadingvideo"><span></span></div></a>';
	let FD = new FormData;
	FD.append('_method', 'user/search');
	FD.append('query', $('#search-user').value);
	fetch('ajax.php', {method: 'POST', body: FD, signal: userSearching.signal}).then(function(res){return res.json()}).then(function(data){
		$('.user-search .results').innerHTML = '';
		if(!data.results || !data.results.length) return;
		data.results.forEach(function(singleResult){
			let item = document.createElement('a');
			item.classList.add('single-result');
			item.href = singleResult.link;

			let avatar = document.createElement('img');
			avatar.src = singleResult.avatar;
			item.appendChild(avatar);

			let name = document.createElement('p');
			name.innerText = singleResult.name;
			item.appendChild(name);


			$('.user-search .results').appendChild(item);
		});
	});
}
function afterRender(){
	onResize();
	$$('.g-recaptcha').forEach(function(el){
		if(typeof grecaptcha.render == 'function')
			grecaptcha.render(el);
	})
	if(window.location.hash == '#moderate' && $('.settPrfl.adm')) $('.settPrfl.adm').click();

	if($('.navSectionPerfil a')){
		if(!$$('.navSectionPerfil a')[0].href)
			$$('.navSectionPerfil a')[0].click();
	}
	if($('.calendar')){
		loadCalendar();
	}
	if( $('.user-search') && $('#search-user:not(.adm)')){
		$('#search-user:not(.adm)').onkeydown = function(){
			if(userSearchWait) window.clearInterval(userSearchWait);
			userSearchWait = setTimeout(doUserSearch, 300);
		}
		
	}

	
	
	
	if($('[name="stars"]')){
		$('[name="review"]').onkeyup = function(){
			if(this.value.length > 1000)
				this.value = this.value.substring(0, 1000);
			$('.charac b').innerText = this.value.length;
		}
	}

	
	
	
	if($('.filename') && $('.inputfile')){
		$$('.inputfile').forEach(function(input){
			let label = input.closest('label').querySelector('.filename');
			label.dataset.original = label.innerText;
			input.onchange = function(){
				let LB;
				if(input.files[0])
					LB = input.files[0].name;
				else
					LB = label.dataset.original;
				input.closest('label').querySelector('.filename').innerText = LB;
			}
		});
	}

	
	
	$$('.slider').forEach(function(item){
		item.closest('.carousel').style.height = item.offsetHeight + 'px';
		item.ondragstart = function(e){carousel.start(item, e);}
		item.ondragend = function(e){carousel.end(item, e);}
		item.ondrag = function(e){carousel.dragging(item, e);}
		let prev = item.closest('.carousel').querySelector('.carousel-prev');
		let next = item.closest('.carousel').querySelector('.carousel-next');
		if(prev) prev.onclick = function(){ carousel.prev(item) };
		if(next) next.onclick = function(){ carousel.next(item) };
		if(item.dataset.autoplay){
			setInterval(function(){ carousel.next(item) }, item.dataset.autoplay);
		}
	});

	if($('#requestModal')){
		$('#requestModal [name="type"]').onchange = function(){
			if(this.value == 'serie' && $('#requestModal [name="exists"]').checked)
				$('#requestEpisodes').style.display='';
			else
				$('#requestEpisodes').style.display='none';
		}
		$('#requestModal [name="exists"]').onclick = function(){
			if($('#requestModal [name="type"]').value == 'serie' && this.checked)
				$('#requestEpisodes').style.display='';
			else
				$('#requestEpisodes').style.display='none';
		}
	}
	bindPagination();

	$$('.load-comments').forEach(function(container){
		if(!container.dataset.post && !container.dataset.episode && !container.dataset.user) return;
		let ref = container.dataset.post || container.dataset.episode || container.dataset.user;
		let type = container.dataset.post ? 'post' : (container.dataset.episode ? 'episode' : 'user');
		loadComments(container, type, ref);
	});

	if(typeof adminAfterRender != 'undefined')
		adminAfterRender();
}

function loadComments(container, type, ref){
	if(!["post", "episode", "review", "user"].includes(type) || !ref || !container) return;
	if(container.classList.contains("isLoading")) return;
	container.classList.add("isLoading");
	let page = container.dataset.page ? parseInt(container.dataset.page)+1 : 1;
	let filter = container.dataset.filter ? container.dataset.filter : 'recent';
	container.dataset.page = page;
	let FD = new FormData;
	FD.append('_method', 'post/reviews');
	FD.append('filter', filter);
	switch(type){
		case "post":FD.append("post_id", ref);break;
		case "episode":FD.append("episode_id", ref);break;
		case "review":FD.append("review_id", ref);break;
		case "user":FD.append("user_id", ref);break;
	}
	FD.append('page', page);
	fetch('ajax.php', {method: 'POST', body: FD}).then(function(res){return res.json()}).then(function(data){
		populateReviews(container, type, ref, data);
		container.classList.remove("isLoading");
	});
}

function populateReviews(container, type, ref, data){
	if(data.nocrit){
		container.classList.add("noCrit");
		container.innerHTML = 'No hay comentarios que mostrar.';
	}
	let wasEmpty = type!='review' ? false : !container.querySelector('.itemCrit');
	if(data.reviews && data.reviews.length){
		data.reviews.forEach(function(singleReview, key){
			let rev = dataToReview(singleReview, type);
			if(wasEmpty && key > 1) rev.querySelector('.itemCrit').classList.add('isHidden');
			container.appendChild( rev );
		});
	}

	if(data.hasMorePages || (wasEmpty && data.reviews && data.reviews.length>2)){
		let loadMore = document.createElement('div');
		loadMore.classList.add('load-more');
		loadMore.innerText = 'Cargar más';
		container.appendChild(loadMore);
		loadMore.onclick = function(){
			if(container.querySelector('.itemCrit.isHidden')){
				container.querySelectorAll('.itemCrit.isHidden').forEach(function(el){ el.classList.remove('isHidden') });
				if(!data.hasMorePages) loadMore.remove();
				return;
			}
			loadMore.remove();
			loadComments(container, type, ref);
		}
	}
}
function dataToReview(singleReview, type){
	let tpl = $('#reviewTemplate').content
	let rev = document.importNode(tpl, true);

	rev.querySelector('.itemCrit').dataset.id = singleReview.id;
	if(singleReview.myVote>0) rev.querySelector('.vote[data-type="up"]').classList.add("voteDones");
	if(singleReview.myVote<0) rev.querySelector('.vote[data-type="down"]').classList.add("voteDones");
	rev.querySelector('.tolVot').innerHTML = singleReview.votes;
	rev.querySelector('.uAvatar img').src = singleReview.user.avatar;
	rev.querySelector('.uAvatar + a').href = singleReview.user.link;
	rev.querySelector('.uAvatar + a').innerHTML = singleReview.user.name;
	if(singleReview.user.role > 0){
		rev.querySelector('.uAvatar + a').classList.add("verified-user");
		let badge = document.createElement('div');
		badge.classList.add("adm-badge");
		badge.innerText = singleReview.user.role_name.substring(0, 3);
		badge.title = singleReview.user.role_name;
		rev.querySelector('.uAvatar + a').appendChild(badge);
	}
	switch(singleReview.action){
		case "remove":rev.querySelector('.uAvatar + a + a').dataset.delcrit = singleReview.id;break;
		case "moderate":rev.querySelector('.uAvatar + a + a').dataset.remcrit = singleReview.id;break;
		case "report":rev.querySelector('.uAvatar + a + a').dataset.repcrit = singleReview.id;break;
	}
	for(let i=0;i<5;i++){
		if(singleReview.stars == 0) break;
		let star = document.createElement('i');
		star.classList.add('material-icons');
		if(i < singleReview.stars) star.classList.add("stOn");
		star.innerText = i<singleReview.stars ? 'star' : 'star_border';
		rev.querySelector('.starContainer').appendChild(star);
	}
	rev.querySelector('.dateContainer').innerText = singleReview.date;
	if(singleReview.comment.length){

		rev.querySelector('.cuerCri').innerHTML = singleReview.comment;
		if(singleReview.spoilers == 1)
			rev.querySelector('.cuerCri').classList.add('spoiler');
	}
	else
		rev.querySelector('.cuerCri').remove();

	if(type=='review'){
		rev.querySelector('.replies').remove();
	} else {
		rev.querySelectorAll('.g-recaptcha').forEach(function(el){
			if(typeof grecaptcha.render == 'function')
				grecaptcha.render(el);
		});
		rev.querySelector('[name="review"]').value = singleReview.id;
		let reply = document.createElement('a');
		reply.classList.add('comment-reply');
		reply.innerText = 'Responder';
		let parent = rev.querySelector('.cuerCri') || rev.querySelector('.headCri');
		parent.classList.add('canReply')
		parent.appendChild(reply);
		reply.onclick = function(){
			let form = this.closest('.itemCrit').querySelector('#CriticarBox');
			form.style.display = form.style.display=='none' ? '' : 'none';
		}
		if(singleReview.replies.reviews && singleReview.replies.reviews.length){
			populateReviews(rev.querySelector('.replies'), 'review', singleReview.id, singleReview.replies);
		}
	}

	return rev;
}
function loadCalendar(){
	$('.calendar .content').innerHTML = '';
	let date = $('#calendar-month').value;
	let type = $('#calendar-filter').value;
	let marked = $('#calendar-marked').value;

	document.cookie = "calendar-marked="+marked+";path=/";

	FD = new FormData;
	FD.append('_method', 'calendar');
	FD.append('date', date);
	FD.append('type', type);
	FD.append('marked', marked);
	fetch('ajax.php', {method: 'POST', body: FD}).then(res => res.json()).then(function(data){
		$$('.calendar-select').forEach(el => el.disabled = false);
		if(data.prev){
			for(i=0;i<data.prev;i++)
				$('.calendar .content').innerHTML += '<div></div>';
		}
		if(data.items){
			Object.entries(data.items).forEach(function(e){
				let links, number;
				[number, links] = e;
				let singleDay = document.createElement('div');
				singleDay.innerHTML = '<div class="number"><span>' + number + '</span></div>';
				singleDay.classList.add('single-day');
				$('.calendar .content').appendChild(singleDay);
				let titles = document.createElement('div');
				titles.classList.add('titles');
				singleDay.appendChild(titles);
				for(i=0;i<3;i++){
					if(!links[i]) break;
					let singleTitle = document.createElement('a');
					singleTitle.classList.add('single-title');
					singleTitle.href = links[i].link;
					singleTitle.innerHTML = '<img src="'+links[i].image+'"/> <span>'+links[i].title+'</span>';
					titles.appendChild(singleTitle);
				}
				if(links.length > 3){
					let more = document.createElement('a');
					more.classList.add('single-title');
					more.classList.add('more');
					more.innerHTML = '<span>Y '+(links.length - 3)+' más...</span>';
					titles.appendChild(more);
					more.onclick = function(){ calendarMore(links); }
				}
			});
		}
	});
}
function calendarMore(links){
	$('#myList').classList.add('myListA');
	$('#myList .calendarMore').innerHTML = '';
	links.forEach(singleLink => {
		let singleLi = document.createElement('li');
		singleLi.innerHTML = '<a href="'+singleLink.link+'"><img src="'+singleLink.image+'"/> '+singleLink.title+'</a>';
		$('#myList .calendarMore').appendChild(singleLi);
	});
}
document.addEventListener('scroll', function(){
	$$('[data-ajaxappend]').forEach(function(el){
		if(el.classList.contains('isLoading')) return;
		let ST = (el.offsetTop + el.offsetHeight) - (document.scrollingElement.scrollTop + document.scrollingElement.clientHeight);
		if(ST >= 300) return;
		if(parseInt(el.dataset.cp) >= parseInt(el.dataset.tp)) return;
		el.classList.add('isLoading');
		data = (el && el.getterData) ? el.getterData : {};
		let page = parseInt(el.dataset.cp) + 1;
		data.page = page;
		el.dataset.cp = page;
		ajaxLoader(el.dataset.ajax, data, true);
	});

});
function countFilters(){
	$('#numelements').innerText = $$('.filterON').length;
}
function bindPagination(){
	$$('.pagPlaydede a').forEach(function(a){ a.onclick = function(e){
		if(!a.dataset.ajax || !a.dataset.ajax.length) return;
		e.preventDefault();
		let ajaxName = a.dataset.ajax;
		let moduleElement = $('.module[data-ajax="'+ajaxName+'"]')
		data = (moduleElement && moduleElement.getterData) ? moduleElement.getterData : {};
		let page = a.querySelector('b').innerText;
		data.page = page;
		if(ajaxLoader(ajaxName, data, true))
			document.scrollingElement.scrollTop = 0;
	}});
}

function initialState(){
	IState = {
		fullBody: $('#main-wrapper .container').innerHTML,
		activeslug: window.infoObj.slug,
		bodyClasses: document.body.className
	}
}
function currentState(){
	let response = {};
	response.modules = [];
	$$('.module[data-ajax]').forEach(function(item){
		response.modules.push({
			name: item.dataset.ajax,
			content: item.outerHTML
		});
	});
	response.activeslug = window.infoObj.slug;
	return response;
}
function ajaxLoader(ajaxName, getterData, appendQS){
	if(ajaxName==0) return;
	if(typeof getterData == 'undefined') getterData = {};
	if(ajaxLoading) ajaxLoading.abort();
	ajaxLoading = new AbortController();
	let signal = ajaxLoading.signal;
	let moduleElement = $('.module[data-ajax="'+ajaxName+'"]');
	if(!moduleElement){
		console.error("No matching module for", ajaxName);
		return false;
	}
	let lastHTML = moduleElement.innerHTML;
	if(moduleElement.dataset.ajaxappend){
		$('.cargaAjax').classList.add('CA_Active');
	} else {
		moduleElement.innerHTML = '<div class="loadingvideo"><span></span></div>';
	}
	let FD = new FormData;
	FD.append('_method', 'items');
	FD.append('page', getterData.page || 1);
	if(getterData.type) FD.append('type', getterData.type);
	if(getterData.username) FD.append('username', getterData.username);
	if(getterData.subtype) FD.append('subtype', getterData.subtype);
	if(getterData.async) FD.append('async', getterData.async);
	if($('.single-network.active')){
		let networks = [];
		$$('.single-network.active').forEach(function(singleNetwork){ networks.push(singleNetwork.dataset.network) });
		FD.append('networks', networks);
	}
	FD.append('ajaxName', ajaxName);
	FD.append('slug', window.infoObj.slug);
	fetch('ajax.php' + (appendQS ? window.location.search : ''), {
		method: 'POST',
		body: FD,
		signal: signal
	}).then(function(res){return res.json()}).then(function(data){
		if(data.render){
			if(moduleElement.dataset.ajaxappend){
				let newElement = document.createElement('div');
				moduleElement.appendChild(newElement);
				newElement.outerHTML = data.render;
				moduleElement.classList.remove('isLoading');
				$('.cargaAjax').classList.remove('CA_Active');
			} else {
				moduleElement.outerHTML = data.render;
				moduleElement = $('.module[data-ajax="'+ajaxName+'"]');
			}

			if(moduleElement){
				moduleElement.getterData = getterData;
				if(data.tp)
					moduleElement.dataset.tp = data.tp;
			}
			bindPagination();
		}
		if(data.pushLocation){
			history.pushState(currentState(), document.title, data.pushLocation);
		}

		
	});
	return true;
}
window.addEventListener('resize', onResize);
function iOS() {
	return [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	].includes(navigator.platform)
		||
	(navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
setInterval(function(){
	$$('.slider').forEach(function(item){
		item.closest('.carousel').style.height = item.offsetHeight + 'px';
	});
}, 500);
function onResize(){
	
	if(iOS()){
	$$('.poster .data').forEach(function(el){
		el.style.width = el.closest('.poster').offsetWidth + 'px';
	});
	}

	if($('#single .content') && $('.sidebar_links')){
		if(window.innerWidth <= 1200)
			$('#single .content').insertBefore($('.sidebar_links'), $('.menuIndexF'));
		else
			$('#single').append($('.sidebar_links'));
	}

	if($('#single .content') && $('.sidebar_serie')){
		if(window.innerWidth <= 1200)
			$('#single .content').insertBefore($('.sidebar_serie'), $('.menuIndexF'));
		else
			$('#single').append($('.sidebar_serie'));
	}



}
window.onpopstate = function(e){
	let state = e.state || IState;
	document.scrollingElement.scrollTop = 0;
	if(state.fullBody){
		$('#main-wrapper .container').innerHTML = state.fullBody;
		if(typeof state.bodyClasses != 'undefined') document.body.className = state.bodyClasses;
		if(typeof state.slug != 'undefined') window.infoObj.slug = state.slug;
		if(typeof state.activeslug != 'undefined') window.infoObj.slug = state.activeslug;
		afterRender();
		return;
	}
	state.modules.forEach(function(singleState){
		let moduleElement = $('.module[data-ajax="'+singleState.name+'"]');
		if(!moduleElement) return;
		moduleElement.outerHTML = singleState.content;
	});
	$$('[data-setslug]').forEach(function(i){ i.classList.remove('nav-A') });
	if($('[data-setslug="'+state.activeslug+'"'))
		$('[data-setslug="'+state.activeslug+'"').classList.add('nav-A');
	infoObj.slug = state.activeslug;
}
var carousel = {
	startX: false,
	startLeft: false,
	firstItem: false,
	start: function(item, e){
		carousel.startX = e.clientX;
		carousel.firstItem = item.querySelectorAll('.item')[0];
		let current = carousel.firstItem.style.marginLeft.length ? parseFloat( carousel.firstItem.style.marginLeft ) : 0;
		carousel.startLeft = current;
		carousel.firstItem.classList.remove('turningBack');
	},
	end: function(item, e){
		e.preventDefault();
		let final = carousel.firstItem.style.marginLeft.length ? parseFloat( carousel.firstItem.style.marginLeft ) : 0;
		let itemWidth = item.querySelectorAll('.item')[0].offsetWidth;
		let fullWidth = item.childElementCount * itemWidth;
		if(final > 0){
			carousel.goto(0)
			return;
		}
		
		if(item.offsetWidth >= item.scrollWidth){	
			carousel.goto( ((fullWidth - item.offsetWidth)*-1), false);
			return;
		}

		let itemKey = e.clientX > carousel.startX ? Math.floor(final*-1 / itemWidth) : Math.ceil(final*-1 / itemWidth);
		carousel.setPos(item, itemKey);
	},
	dragging: function(item, e){
		e.preventDefault();
		if(!e.clientX) return;
		let diff = e.clientX - carousel.startX;
		if(  (carousel.startLeft > -50 && diff > 0) || (carousel.firstItem.offsetWidth*2)>=item.scrollWidth){
			diff *= 0.3;
		}
		let newLeft = (carousel.startLeft + diff);
		carousel.firstItem.style.marginLeft = newLeft + "px";
	},
	goto: function(to, item){
		if(typeof item=='undefined') item = false;
		let TBItem = item;
		if(!TBItem) TBItem = carousel.firstItem;
		TBItem.classList.add('turningBack');
		setTimeout(function(){ TBItem.classList.remove('turningBack') }, 300);
		TBItem.style.marginLeft = to + 'px';
	},
	prev: function(item){
		let curr = carousel.getPos(item);
		let total = carousel.getCount(item);
		curr--;
		if(curr < 0) curr = total;
		carousel.setPos(item, curr);
	},
	next: function(item){
		let curr = carousel.getPos(item);
		let total = carousel.getCount(item);
		curr++;
		if(curr > total) curr = 0;
		carousel.setPos(item, curr);
	},
	getCount: function(item){
		let firstItem = item.querySelectorAll('.item')[0];
		if(!firstItem) return 0;
		let itemWidth = firstItem.offsetWidth;
		let showed = Math.ceil( item.offsetWidth / itemWidth );
		return item.childElementCount - showed;
	},
	getPos: function(item){
		if(typeof item.dataset.pos != "undefined") return parseInt(item.dataset.pos);
		let firstItem = item.querySelectorAll('.item')[0];
		if(!firstItem) return 0;
		let marginLeft = firstItem.style.marginLeft.length ? parseFloat( firstItem.style.marginLeft ) : 0;
		let itemWidth = firstItem.offsetWidth;
		return Math.floor( marginLeft / itemWidth ) * -1;
	},
	setPos: function(item, key){
		let firstItem = item.querySelectorAll('.item')[0];
		if(!firstItem) return;
		let itemWidth = firstItem.offsetWidth;
		carousel.goto( (key * itemWidth) * -1, firstItem);
		item.dataset.pos = key;

	}
}


window.__onGCastApiAvailable = function(isAvailable){
	if(! isAvailable){
		return false;
	}
	if(!$('.loadedPlayer .innerPlayer iframe')){
		return false;
	}

	var castContext = cast.framework.CastContext.getInstance();

	castContext.setOptions({
		autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
		receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
	});

	var stateChanged = cast.framework.CastContextEventType.CAST_STATE_CHANGED;
	castContext.addEventListener(stateChanged, function(event){
		var castSession = castContext.getCurrentSession();
		var media = new chrome.cast.media.MediaInfo($('.loadedPlayer .innerPlayer iframe').src, 'text/html');
		var request = new chrome.cast.media.LoadRequest(media);

		castSession && castSession
			.loadMedia(request)
			.then(function(){
				console.log('Success');
			})
			.catch(function(error){
				console.log('Error: ' + error);
			});
	});
};
