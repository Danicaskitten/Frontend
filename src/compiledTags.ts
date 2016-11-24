/*** This file is auto-generated. ***/

export var precompiledTags: {[fileName: string]: { tagName: string, html: string, css: string, attribs: string, js: string } } = { };

precompiledTags["app"] = { tagName: 'app', html: '<navigation></navigation> <chat-view show="{active === 1}"></chat-view> <div show="{active === 2}">Search</div> <div show="{active === 3}">Dashboard</div> <div show="{active === 4}">Profile</div>', css: '', attribs: '', js: '' }

precompiledTags["chat-reply"] = { tagName: 'chat-reply', html: '<img show="{!me}" riot-src="{url}"> <div class="text-container"> <h4>{name}</h4> {text} <i>{time}</i> </div> <img show="{me}" riot-src="{url}">', css: '', attribs: 'class="{right:me}"', js: '' }

precompiledTags["chat-view"] = { tagName: 'chat-view', html: '<chat></chat> <input onkeypress="{checkIfWriting}" id="chat-reply" class="chat-input"> <button id="send-reply-button" onclick="{sendReplyToBot}" class="chat-input-button"> <i class="fa fa-paper-plane" aria-hidden="true"></i> Send </button>', css: '', attribs: '', js: '' }

precompiledTags["chat"] = { tagName: 'chat', html: '<chat-reply each="{reply}"></chat-reply>', css: '', attribs: '', js: '' }

precompiledTags["navigation"] = { tagName: 'navigation', html: '<a show="{!showMenu}" class="menu-icon" onclick="{toggleMenu}"> <i class="fa fa-bars" aria-hidden="true"></i> </a> <h3 show="{!showMenu}"> <i class="fa fa-film" aria-hidden="true"></i> MovieBot </h3> <ul show="{showMenu}"> <li class="user-profile"> <i class="fa fa-bars second-menu" aria-hidden="true" onclick="{toggleMenu}"></i> <div> <img riot-src="{userurl}"> </div> <a onclick="{redirectToProfile}"> <i> {username}</i> </a> </li> <li class="{active: active === 3} hover-color"> <a onclick="{redirectToDashboard}"> <i class="fa fa-th" aria-hidden="true"></i>Dashboard </a> </li> <li class="{active: active === 2} hover-color"> <a onclick="{redirectToSearch}"> <i class="fa fa-search" aria-hidden="true"></i> Search </a> </li> <li class="{active: active === 1} hover-color"> <a onclick="{redirectToChat}"> <i class="fa fa-comments-o" aria-hidden="true"></i>Chat </a> </li> </ul> <div show="{active !== 1}" onclick="{redirectToChat}"> <i class="fa fa-comments-o" aria-hidden="true"></i> </div>', css: '', attribs: '', js: '' }

precompiledTags["search-view"] = { tagName: 'search-view', html: '', css: '', attribs: '', js: '' }

