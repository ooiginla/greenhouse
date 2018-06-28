import m from 'mithril';
import Siema from 'siema';

import menu from './#menu.js';
import footer from './#footer.js';
import Icons from './#icons.js';

import {appAlert} from './#utils.js';
import {checkRedirect} from './#utils.js';


var page = {

	clickedNewsletter: false,
	IpAddress:"", UserAgent:"",
	FormNewsletter : {Firstname:"",Lastname:"",Email:""},
	submitNewsletter: function() {
		var alert = []
		if (page.clickedNewsletter) {
			console.log("page.clickedNewsletter: "+page.clickedNewsletter)
			appAlert([{ message: "Signed up already!!" }]); return
		}


		page.FormNewsletter.IpAddress = page.IpAddress
		page.FormNewsletter.UserAgent = page.UserAgent

		if (page.FormNewsletter.Firstname.length == 0) { alert.push({ message: "First Name is required" }); }
		else if (page.FormNewsletter.Lastname.length < 3) { alert.push({ message: "Last Name is required" });}

		if (page.FormNewsletter.Lastname.length == 0) { alert.push({ message: "Last Name is required" }); }
		else if (page.FormNewsletter.Lastname.length < 3) { alert.push({ message: "Last Name is too short" }); }

		if (page.FormNewsletter.Email.length == 0) { alert.push({ message: "Email is required" }); }
		else if(!page.FormNewsletter.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
			alert.push({ message: "Email is invalid" });
		}

		if (alert.length > 0) {
			page.clickedNewsletter = false
			appAlert(alert)
			return
		}

		// startLoader();
		page.FormNewsletter.List = "signup-newsletter"
		page.FormNewsletter.Notify = "signup-newsletter-notify"
		m.request({ method: 'POST', url: "/api/signup-newsletter", data: page.FormNewsletter, }).then(function(response) {
			var lStoploader = true;
			if (response.Message !== null &&  response.Message !== "") {
				appAlert([{ message: response.Message }]);

			}
			// if(lStoploader) { stopLoader();}
		}).catch(function(error) {
			appAlert([{ message: error }]);
			// stopLoader();
		});

		page.clickedNewsletter = true
		page.FormNewsletter = {Firstname:"",Lastname:"",Email:""};
	},

	sliderInterval:30000, mySiema:{}, sliderTimeout:{}, sliderContainer:[],
	sliderPrev: function(vnode){ page.mySiema.prev(); clearTimeout(page.sliderTimeout);
		page.sliderTimeout = setTimeout(function(){page.sliderPrev()}, page.sliderInterval);
	},
	sliderNext: function(vnode){ page.mySiema.next(); clearTimeout(page.sliderTimeout);
		page.sliderTimeout = setTimeout(function(){page.sliderNext()}, page.sliderInterval);
	},
	sliderItem: { view: function(vnode) {
		return(m("div",{class:"w-100 vh-75 vh-50 parallaxBG", style:"background-image:url('../../"+vnode.attrs.filepath+"');"},))
	}},
	sliderInit: function(vnode){
		var searchList = [];
		searchList.push(m(page.sliderItem,{filepath:"assets/img/hero-two.jpg"}));
		searchList.push(m(page.sliderItem,{filepath:"assets/img/hero-one.jpg"}));
		searchList.push(m(page.sliderItem,{filepath:"assets/img/hero-three.jpg"}));
		searchList.push(m(page.sliderItem,{filepath:"assets/img/hero-six.jpg"}));
		searchList.push(m(page.sliderItem,{filepath:"assets/img/hero-five.jpg"}));
		if(searchList.length > 0) {
			page.sliderContainer = searchList; m.redraw();
			page.mySiema = new Siema({loop:true,duration: 750,});
			page.sliderTimeout = setTimeout(function(){page.sliderNext()}, page.sliderInterval);
		}

		// var searchList = [m(page.sliderItem,{title:"NEW SLIDER",filepath:"/assets/img/banner.png"})];
		// page.sliderContainer = searchList
		// m.redraw()
		// page.mySiema = new Siema({loop:true,duration: 1000,});

		/*
		m.request({ method: 'POST', url: "https://edgevillaestate.com/api/gallery",data:{} }).then(function(response) {
			searchList = [];
			checkRedirect(response);
			if (response.Code == 200) {
				if (response.Body !== null && response.Body !== undefined ){
					response.Body.map(function(result) { searchList.push(m(page.sliderItem,{title:result.Title,filepath:result.Filepath}))})
				}
			}
			if(searchList.length > 0) {
				page.sliderContainer = searchList
				m.redraw()
				page.mySiema = new Siema({loop:true,duration: 1000,});
				page.sliderTimeout = setTimeout(function(){page.sliderNext()}, page.sliderInterval);
			}
		}).catch(function(error) {
			appAlert([{ type: 'bg-red', message: "Network Connectivity Error \n Please Check Your Network Access", }]);
		});
		*/
		// var searchList = [];
		// searchList.push(m(page.sliderItem,{title:"NEW SLIDER",filepath:"/assets/img/banner.png"}));
		// searchList.push(m(page.sliderItem,{title:"NEW SLIDERX",filepath:"/assets/img/banner.png"}));
		// if(searchList.length > 0) {
		// 	page.sliderContainer = searchList
		// 	m.redraw()
		// 	page.mySiema = new Siema({loop:true,duration: 1000,});
		// 	page.sliderTimeout = setTimeout(function(){page.sliderNext()}, page.sliderInterval);
		// }
	},
	oninit:function(vnode){
		m.mount(document.getElementById('appMenu'), menu)
		m.mount(document.getElementById('appFooter'), footer);
		// setTimeout(function(){page.sliderInit()},250);

		m.request({method:'GET', url: "https://icanhazip.com/",
			deserialize: function(value) {return value}}).then(function(response){
			page.IpAddress = response;
			page.UserAgent = navigator.userAgent;
		});

		//search for published gallery images and display them here


		//simple load list and show
	},
	view:function(vnode){
		return (
			<section style="" class="min-vh-100">
				<article class="pt3" id="gallery">
					<div class="flex flex-column flex-row-l">
						<div class="w-100 mw8 center relative">
							<div class="siema vh-75 vh-50 w-100">
								{page.sliderContainer}
							</div>

							<article class="absolute top-0 vh-75 vh-50 dt w-100 bg-black-40">
							  <div class="dtc v-btm-m v-mid">
									<div class="measure center br2 pa3 tc">
										<p class="f5 fw4 white tracked"> The Greenhouse provides a safe space for women and youth to meet, work, learn and collaborate</p>
										<Icons onclick={page.sliderPrev} name="chevron-left" class="absolute pointer h1 ph1 pv2 z-max bg-black-50 br--right br2 light-gray left-0"/>
										<Icons onclick={page.sliderNext} name="chevron-right" class="absolute pointer h1 ph1 pv2 z-max bg-black-50 br--left br2 light-gray right-0"/>

										<a class="mv2 f6 fw5 tracked white bg-dark-red hover-bg-black hover-white br2 no-underline pv3 ph4 dib mr3" href="#signmeup">
								      SIGN ME UP
								    </a>
								    <a oncreate={m.route.link} class="mv2 f6 fw5 tracked no-underline black bg-white hover-bg-black hover-white br2 pv3 ph4 dib" href="/contactus">
								      CTA TWO
								    </a>
									</div>
								</div>
							</article>
						</div>
					</div>
				</article>

				<section class="mw8 bg-white tc center pa2">
					<h1 class="f1 i black athelas">
						About Us
						<p class="f4 fw1 pv0 mv0">
							A quick introduction to Greenhouse
						</p>
					</h1>

					<section class="cf">
						<div class="fl w-100 w-50-l pv2 ph2">
							<img class="br3 shadow-5" src="assets/img/greenhouse.jpeg"/>
						</div>

						<div class="fl w-100 w-50-l pv2 ph2 tj">
							<p class=" lh-copy">
								The Greenhouse provides a safe space for women and youth, where they can come to gain access to resources that enable their creative expressions.
							</p>
							<p class=" lh-copy">
								Greenhouse provides an enabling environment for women and youth to meet, work, learn and collaborate,
								while ensuring that they become innovators.
								Comprehensive programs which include practical ICT sessions, Entrepreneurship workshops,
								Financial Literacy inclusion, Social Advocacy - online and offline peer meets, Career Talks
								as well as interactive extra-curricular activities e.g. book reading, gaming and dancing sessions
								are all included in the hub activities to help the young women in their growth to running
								productive and sustainable businesses.
							</p>

							<a oncreate={m.route.link} class="link link white f6" href="/contactus">
								<small class="pa2 ph3 bg-dark-green b hover-bg-near-white hover-black br2 tracked">Contact Us</small>
							</a>
						</div>
					</section>

					<h1 class="f2	 i black athelas">
						FEATURED PRODUCTS
						<p class="f4 fw1 pv0 mv0">
							Best & most popular of our greenhouses
						</p>
					</h1>

					<div class="fl tr w-100">
						<Icons name="chevron-left" class="h1 ph1 black-20 pointer grow"/>
						<Icons name="chevron-right" class="h1 ph1 black-50 pointer grow"/>
					</div>
				  <div class="cf pa1 overflow-scroll">
				    <div class="dib w-50 w-25-m w-20-l pa2">
							<a href="" class="db link dim tl">
				        <img src="http://is3.mzstatic.com/image/thumb/Music49/v4/b6/b0/a1/b6b0a1dd-998d-9786-ca2f-87470be15250/source/400x40000bb.png" class="db w-100 br2 br--top"/>
							  <div class="pb3-ns">
							    <p class="f6 h3 overflow-hidden lh-copy measure mt2 mid-gray ttu">
							     DECADE OF WOMEN CELEBRATES THE LAUNCH OF THE YEAR OF WOMEN
							    </p>
									<div class="ml0 db gray truncate w-100 f6">20 June 2018</div>
							  </div>
				      </a>
				    </div>
				    <div class="dib w-50 w-25-m w-20-l pa2">
				      <a href="" class="db link dim tl">
				        <img src="http://placekitten.com/g/600/300" class="db w-100 br2 br--top"/>
							  <div class="pb3-ns">
							    <p class="f6 h3 overflow-hidden lh-copy measure mt2 mid-gray ttu">
							      “Satoshi Is Female” Movement Gains More Momentum at Blockchain for Impact Global Summit
							    </p>
									<div class="ml0 db gray truncate w-100 f6">20 June 2018</div>
							  </div>
				      </a>
				    </div>
				    <div class="dib w-50 w-25-m w-20-l pa2">
				      <a href="" class="db link dim tl">
				        <img src="http://is5.mzstatic.com/image/thumb/Music49/v4/1b/36/43/1b3643c6-e6a3-41bc-7f6d-7c2b64b5d60b/source/400x40000bb.png" class="db w-100 br2 br--top"/>
							  <div class="pb3-ns">
							    <p class="f6 h3 overflow-hidden lh-copy measure mt2 mid-gray ttu">
							      GINA TORRY AND INGRID STANGE
							    </p>
									<div class="ml0 db gray truncate w-100 f6">20 June 2018</div>
							  </div>
				      </a>
				    </div>
				    <div class="dib w-50 w-25-m w-20-l pa2">
				      <a href="" class="db link dim tl">
				        <img src="http://is4.mzstatic.com/image/thumb/Music49/v4/e9/4c/2d/e94c2d5f-bdb0-c565-4cc2-f9dfcf7f0b87/source/400x40000bb.png" class="db w-100 br2 br--top"/>
							  <div class="pb3-ns">
							    <p class="f6 h3 overflow-hidden lh-copy measure mt2 mid-gray ttu">
							      GINA TORRY AND INGRID STANGE AS CO-RECIPIENTS OF QUANTUM IMPACT AWARD
							      GINA TORRY AND INGRID STANGE AS CO-RECIPIENTS OF QUANTUM IMPACT AWARD
							    </p>
									<div class="ml0 db gray truncate w-100 f6">20 June 2018</div>
							  </div>
				      </a>
				    </div>
				    <div class="dib w-50 w-25-m w-20-l pa2">
				      <a href="" class="db link dim tl">
				        <img src="http://is1.mzstatic.com/image/thumb/Music71/v4/c8/2d/b1/c82db1cd-9dc5-d7cb-2a34-735cf47bb809/source/400x40000bb.png" class="db w-100 br2 br--top"/>
							  <div class="pb3-ns">
							    <p class="f6 h3 overflow-hidden lh-copy measure mt2 mid-gray ttu">
							      GINA TORRY AND INGRID STANGE AS CO-RECIPIENTS OF QUANTUM IMPACT AWARD
							    </p>
									<div class="ml0 db gray truncate w-100 f6">20 June 2018</div>
							  </div>
				      </a>
				    </div>
				  </div>
				</section>

				<section class="dn cf mw8 bg-white center pv3" style="">
					<div class="fl w-100 w-40-m w-50-l pv2 pl2 pr3">
						<img src="assets/img/empowerher.jpg"/>
						<h2 class="ph2 pv3">ABOUT US</h2>
						<p class="ph2 tj">
							The Greenhouse provides safe space for women and youth, where
							they can come to gain access to resources that enable their creative expressions.
						</p>
						<a class="w4 center no-underline f6 tc db pv3 bg-animate bg-red hover-bg-blue white br2 fw">READ MORE...</a>
					</div>
					<div class="fl w-100 w-60-m w-50-l pv2 pl3 pr2">
						<img src="assets/img/empowerher-flyer.jpg"/>
						<h2 class="ph2 pv3">EMPOWER HER</h2>
						<p class="ph2 tc ">
						The Technology and Entrepreneurship program is aimed at demonstrating the role of technology in supporting and facilitating enterprise, especially Women-led initiatives
						</p>
						<a class="w5 center no-underline f6 tc db pv3 bg-animate bg-blue hover-bg-dark-blue white br2 fw">Sign me up!!!</a>
					</div>
				</section>


				<section class="dt w-100">
					<div class="dtc v-mid tc near-white">
						<div class="ph2 pv3">
						  <div class="pv3 mw6 mw7-l center br2 ">
						    <span class="cf bn ma0 pa0">
									<legend class="pa0 f5 f4-ns mb3 white-90 tc  ttu tracked w-100">COUNT ME IN</legend>
									<legend class="pa0 f6 f5-ns mb3 white-90 tc tracked w-100">
										<small>You can start by signing the guest book...</small>
									</legend>
						      <div class="fl w-50 w-25-l ph1 pv1">
										<label class="clip" for="first-name">First Name</label>
										{m("input",{ type:"text", placeholder: "Your First Name", value:page.FormNewsletter.Firstname,
											class: "f6 input-reset bn fl black bg-white w-100 pa3 lh-solid br2-ns",
											oninput: m.withAttr("value",function(value) {page.FormNewsletter.Firstname = value}),
											onkeyup: function(event) {if(event.key=="Enter"){page.submitNewsletter}}
										})}
									</div>
									<div class="fl w-50 w-25-l ph1 pv1">
										<label class="clip" for="last-name">Last Name</label>
										{m("input",{ type:"text", placeholder: "Your Last Name", value:page.FormNewsletter.Lastname,
											class: "f6 input-reset bn fl black bg-white w-100 pa3 lh-solid br2-ns",
											oninput: m.withAttr("value",function(value) {page.FormNewsletter.Lastname = value}),
											onkeyup: function(event) {if(event.key=="Enter"){page.submitNewsletter}}
										})}
									</div>
						      <div class="fl w-100 w-50-l ph1 pv1">
						        <label class="clip" for="email-address">Email Address</label>
										{m("input",{ type:"text", placeholder: "Your Email Address", value:page.FormNewsletter.Email,
											class: "f6 input-reset bn fl black bg-white pa3 lh-solid w-100 w-70-m w-70-l br2-ns br--left-ns",
											oninput: m.withAttr("value",function(value) {page.FormNewsletter.Email = value}),
											onkeyup: function(event) {if(event.key=="Enter"){page.submitNewsletter}}
										})}
										{m("span",{ onclick: page.submitNewsletter,
												class: "fl f6 pv3 tc bn bg-animate ttu tracked bg-near-white fw5 hover-bg-blue dark-green pointer w-100 w-30-m w-30-l br2-ns br--right-ns",
										},"Sign Me Up")}
						      </div>
						    </span>
						  </div>
						</div>
					</div>
				</section>

			</section>
		)
	}
}

export default page;
