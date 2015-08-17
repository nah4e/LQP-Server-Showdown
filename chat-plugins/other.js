// Le reste des commandes 

var isIn = function(arr, arg) {
	for(var i in arr) {
		if (toId(arr[i]) === toId(arg)) return true; 
	}
	return false;
}

exports.commands = {
	 luca: 'luke',
	 luka: 'luke',
	 luke: function (target, room, user) {
	 	if (!this.can('kill') || !target) return false; 
	 	this.add('|c|$Lucariо|'+ target);
	 },

     unmuteall: function(target, room, user) {
      if (!this.can('mute')) return false;
	  var specifiedUsers  = target.split(',');
	  var stillMutedUsers = [];
	  
	  for(var i in specifiedUsers) {
	  	stillMutedUsers.push(toId(specifiedUsers[i]));
	  }
	  
      for (var i in Users.users) {
      	if (isIn(stillMutedUsers, i)) continue; 
        this.parse('/unmute '+ i);
      }
      this.privateModCommand(user.name + ' a unmuteall. Argument: "'+ target +'"'); 
     },

	cries: function (target) {
		if (!this.canBroadcast()) return; 
		if (!target || (isNaN(target) && toId(target) !== 'random')) return false;
		target = toId(target);
		if (target === 'random' || target === 'rand' || target === 'aleatoire') {
			target = Math.floor(Math.random() * 718);
		}
		if (target < 1 || target > 718) { 
			return this.sendReply('Le Pokémon indiqué doit avoir un numéro de Pokédex national entre 1 et 718.');
		}	
		if (target < 100 && target > 9) {
			target = '0' + target; 
		} 
		if (target < 10) {
			target = '00' + target;
		}
		this.sendReplyBox(
			'<center><audio src="http://play.pokemonshowdown.com/audio/cries/'+ target +'.wav" controls="" style="padding: 5px 7px ; background: #8e44ad ; color: #ecf0f1 ; -webkit-border-radius: 4px ; -moz-border-radius: 4px ; border-radius: 4px ; border: solid 1px #20538d ; text-shadow: 0 -1px 0 rgba(0 , 0 , 0 , 0.4) ; -webkit-box-shadow: inset 0 1px 0 rgba(255 , 255 , 255 , 0.4) , 0 1px 1px rgba(0 , 0 , 0 , 0.2) ; -moz-box-shadow: inset 0 1px 0 rgba(255 , 255 , 255 , 0.4) , 0 1px 1px rgba(0 , 0 , 0 , 0.2) ; box-shadow: inset 0 1px 0 rgba(255 , 255 , 255 , 0.4) , 0 1px 1px rgba(0 , 0 , 0 , 0.2)" target="_blank"></audio>'
		)
	},
	
    yt: function(target, room, user) {
       	if (!this.canBroadcast()) return false;
        if (!target) return false;
        var params_spl = target.split(' ');
        var g = '';

        for (var i = 0; i < params_spl.length; i++) {
            g += '+' + params_spl[i];
        }
        g = g.substr(1);

        var reqOpts = {
            hostname: "www.googleapis.com",
            method: "GET",
            path: '/youtube/v3/search?part=snippet&q=' + g + '&type=video&key=AIzaSyA4fgl5OuqrgLE1B7v8IWYr3rdpTGkTmns',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var self = this;
        var data = '';
        var req = require('https').request(reqOpts, function(res) {
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                var d = JSON.parse(data);
                if (d.pageInfo.totalResults == 0) {
                    room.add('Aucune vidéo trouvée :(. T\'as voulu me ruser ?');
                    room.update();
                    return false;
                } 
                self.sendReplyBox('<a href="https://www.youtube.com/watch?v=' + d.items[0].id.videoId +'"><b> '+ d.items[0].snippet.title +'</b>');
            	room.update();
            });
        });
        req.end();
        console.log('[YT] '+ user +': '+ target);
    },

     
	 roumain: function(target, room, user) {
	 	if (!this.canBroadcast()) return false; 
	 	var self = this; 
	 	setTimeout(function() {
	 		return toId(target) === 'trop' ? self.parse('!roomintro') : self.serverLog(user +'...');
	 	}, 1); 
	 	room.update();
	 },

	 permalock: function(target, room, user) {
	 	if (!this.can('hotpatch') || !target) return false; 
	 	user   = toId(user); 	
	 	target = this.splitTarget(target);
	 	
		var targetUser = this.targetUser;
		console.log(Rooms); //(data, param, target)
	 },
	 
	 serveur: 'sendserver',
	 server: 'sendserver',
	 sayserver: 'sendserver',
	 sendserver: function(target, room, user, connection) {
		if (!this.can('lock')) return false; 
		if (!target) {
			return this.sendReply('Syntaxe incorrecte.');
		}
		this.add('|c| [Serveur]|'+ target);
		
		this.privateModCommand(user.name +" a envoyé un message de [serveur] sous les paramètres: "+ target);
	},

	js: function(target, room, user, connection) {
		if (!this.can('lock') || !target) return false; 
		console.log('[JS] '+ user.name +': '+ target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< ' + eval(target));
		} catch (e) {
			this.sendReply('||<< error: ' + e.message);
			var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
			connection.sendTo(room, stack);
		}
	},
	 
     pmall: function(target, room, user) {
      if (!this.can('lock') || !target) return false;

      for (var i in Users.users) {
        var message = '|pm| [Serveur]|'+ Users.users[i].getIdentity() +'|'+target;
        Users.users[i].send(message);
      }
      this.privateModCommand(user.name + ' a pmall "'+ target +'"'); 
     },
     
     cleanuserauth: function (target, room, user, connection) {
     	if (!this.can('banip') || !target) return false; // leader 
	 	user   = toId(user); 	
	 	target = this.splitTarget(target);
		var targetUser = this.targetUser;
     	try {
     		console.log(targetUser);
     		//console.log(Rooms);
     		console.log(room.auth)
     		for(var i in Rooms) {
     			console.log(Rooms.id[i]);
     		}
     	} catch (e) {
     		throw e; 
     	}
     },
     
     servpm: 'greathl',
	 greathl: function (target, room, user, connection) {
	 	if (!target || !this.can('lock')) return false;  //(data, param, target) 
	 	user   = toId(user); 
	 	target = this.splitTarget(target);
	 	if (!target[0] || !target[1]) return false;
		var targetUser = this.targetUser;
		if (!targetUser) return false;
		this.serverLog(target, 'pm', targetUser)
		this.privateModCommand(user + ' a servpm "'+ targetUser +'" et a envoyé "'+ target+'"'); 
		this.targetUser.send(target);
	 },
	 
    pltan: function(target, room, user) {
	 	if (room.id !== 'pl') return this.sendReply("La commande '/pltan' n'existe pas. Pour envoyer un message commençant par '/pltan', tapez '//pltan'.")
	 	// si room.id n'est pas 'pl', on feinte
	 	
		if (!target) { // si pas d'argument après la commande 
			if (user.avatar == 'rebeutan.png') return this.sendReply("Vous avez déjà pltan.");
			user.avatar = 'rebeutan.png'; 
			return room.add(user.name + " s'est fixé pltan.");
		}
		
		target = this.splitTarget(target);
		if (!this.can('modchat', null, room)) return;
	 	// mods only 
	 	
		if (!this.targetUser) return this.sendReply("Cette personne n'est pas référencée dans les fichiers du Reich."); 
		// si utilisateur non spécifié / trouvé 
		
		if (!room.users[this.targetUser.userid]) return this.sendReply("Cette personne n'a pas de bonnes opinions politiques.");
		// si l'utilisateur n'est pas dans la room 
		
		if (this.targetUser.avatar == 'rebeutan.png') return this.sendReply("ILLA DER JA");
		this.targetUser.avatar = 'rebeutan.png'; 
		return room.add(this.targetUser.name + " est pltan par "+ user.name + '.');
	 },
	 
	 
	 
	skype: function (target) { 
	    if (!this.canBroadcast()) return;
	    var txt = "<u><b>Skype de "+ target +":</b></u> ";

	    target = toId(target);
	    switch(target) {
	    	case 'paul': 
	    	case 'paullelucario': 
	    	case 'lucario':
	    	case 'fondateurlucario': 
	    		this.sendReplyBox(txt + "<i>live:dauphin076</i>");
	    		break; // facil 
	    	case 'erza':
	    	case 'wettin':
	    	case 'noruega':
	    	case 'pacificerza':
	    	case 'rocketleadererza': 
	    		this.sendReplyBox(txt + "<i>erzavserza</i>");
	    		break;
	    	case 'claerina':
	    	case 'clae':
	    		this.sendReplyBox(txt + "<i>claeeee</i>");
	    		break; 
	    	case 'rambol':
	    	case 'jeanmichelcrapo':
	    		this.sendReplyBox(txt + "<i>dragon-cochon277</i>");
	    		break; 
	    	case 'skyrio':
	    		this.sendReplyBox(txt + "<i>lucario66350</i>");
	    		break;
	    	case 'panur':
	    	case 'panure':
	    		this.sendReplyBox(txt + "<i>sli404</i>");
				break; 
			case 'mindnight':
				this.sendReplyBox(txt + "<i>mindnight64</i>");
				break;
			case 'miang':
			case 'earth':
				this.sendReplyBox(txt + "<i>sunny.k131</i>");
				break;
			case 'yarti':
				this.sendReplyBox(txt + "<i>shisengumiialex</i>");
				break;
			case 'bd':
			case 'blazingdark':
			case 'blazingdarkx':
			case 'karimfire':
				this.sendReplyBox(txt + "<i>blazingdark18</i>");
				break;
			case 'blue':
			case 'trainerpkmnblue':
			case 'bluenigars':
				this.sendReplyBox(txt + "<i>live:maleficblade</i>");
				break;
			case 'aide':
			case 'help':
				this.sendReplyBox("Si vous souhaitez que votre identifiant Skype soit retiré ou ajouté dans cette liste, ou que vous souhaitez le modifier, adressez-vous à un codeur connecté qui le fera aussitôt que possible.");
				break;
	    	default: 
	    		this.sendReplyBox("Le Skype de cette personne n'est pas assez inétressant pour apparaître dans notre base de données.");
	    }
	},
	

	
	random: function(target, room) { 
		if (!this.canBroadcast() || !target) return; 
		if (room.id !== 'caferza' && room.id !== 'dev') return this.sendReply("Cette commande n'est pas disponible dans cette salle.");
		// si room.id n'est pas caferza ni codeurs, message d'erreur 
		
		var isRandom = Math.random() < 0.7 ? true : false; 
		// chance de 70% qu'un utilisateur soit dit "random"
		
		if (toId(target) == 'panur' || toId(target) == 'panure') isRandom = false;

		// si isRandom = true 
		if (isRandom) {
			var percent = Math.floor(Math.random() * 100) + 1; 
			this.sendReplyBox(
				target + ' est <b>'+ percent +'%</b> aléatoire.'
			);
		} else { 
			//sinon
			this.sendReplyBox(
				target + ' n\'est pas random...'	
			);
		}
	}
};
