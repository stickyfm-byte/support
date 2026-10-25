// Interface translations. Each row is [English, Español, Français, Deutsch, Português].
// To add a language: add it to LANGS and add one more string to every row. Missing strings fall back to English.
import { getPrefs } from "/prefs.js";
export const LANGS = [["en", "English"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["pt", "Português"]];
export const TAGS = { en: "en-GB", es: "es", fr: "fr", de: "de", pt: "pt-BR" };
const T = {
"nav.help": [
"Help centre",
"Centro de ayuda",
"Centre d'aide",
"Hilfezentrum",
"Central de ajuda"
],
"nav.requests": [
"My requests",
"Mis solicitudes",
"Mes demandes",
"Meine Anfragen",
"Meus pedidos"
],
"nav.signin": [
"Sign in",
"Iniciar sesión",
"Se connecter",
"Anmelden",
"Entrar"
],
"nav.new": [
"New request",
"Nueva solicitud",
"Nouvelle demande",
"Neue Anfrage",
"Novo pedido"
],
"nav.menu": [
"Menu",
"Menú",
"Menu",
"Menü",
"Menu"
],
"nav.skip": [
"Skip to content",
"Saltar al contenido",
"Aller au contenu",
"Zum Inhalt springen",
"Pular para o conteúdo"
],
"nav.settings": [
"Settings",
"Ajustes",
"Paramètres",
"Einstellungen",
"Configurações"
],
"theme.toLight": [
"Switch to light theme",
"Cambiar al tema claro",
"Passer au thème clair",
"Zum hellen Design wechseln",
"Mudar para o tema claro"
],
"theme.toDark": [
"Switch to dark theme",
"Cambiar al tema oscuro",
"Passer au thème sombre",
"Zum dunklen Design wechseln",
"Mudar para o tema escuro"
],
"status.default": [
"Status",
"Estado",
"Statut",
"Status",
"Status"
],
"status.ok": [
"All systems operational",
"Todos los sistemas operativos",
"Tous les systèmes fonctionnent",
"Alle Systeme laufen",
"Todos os sistemas operando"
],
"status.warn": [
"Some services affected",
"Algunos servicios afectados",
"Certains services sont touchés",
"Einige Dienste betroffen",
"Alguns serviços afetados"
],
"status.down": [
"Service disruption",
"Interrupción del servicio",
"Interruption de service",
"Dienststörung",
"Interrupção do serviço"
],
"footer.terms": [
"Terms",
"Términos",
"Conditions",
"Bedingungen",
"Termos"
],
"footer.privacy": [
"Privacy",
"Privacidad",
"Confidentialité",
"Datenschutz",
"Privacidade"
],
"brand.support": [
"Support",
"Soporte",
"Assistance",
"Support",
"Suporte"
],
"home.eyebrow": [
"Mirage Support",
"Soporte de Mirage",
"Assistance Mirage",
"Mirage Support",
"Suporte Mirage"
],
"home.h1a": [
"How can we",
"¿Cómo podemos",
"Comment pouvons-nous",
"Wie können wir",
"Como podemos"
],
"home.h1b": [
"help?",
"ayudarte?",
"vous aider ?",
"helfen?",
"ajudar?"
],
"home.lead": [
"Quick answers to the usual questions, and a real person when you need one.",
"Respuestas rápidas a las dudas habituales y una persona real cuando la necesites.",
"Des réponses rapides aux questions courantes, et une vraie personne quand il le faut.",
"Schnelle Antworten auf die üblichen Fragen und ein echter Mensch, wenn du einen brauchst.",
"Respostas rápidas para as dúvidas comuns e uma pessoa de verdade quando precisar."
],
"home.search": [
"Search for a problem or topic",
"Busca un problema o tema",
"Rechercher un problème ou un sujet",
"Nach einem Problem oder Thema suchen",
"Pesquise um problema ou assunto"
],
"home.popular": [
"Popular right now",
"Popular ahora",
"Populaires en ce moment",
"Gerade beliebt",
"Em alta agora"
],
"home.writers": [
"Meet the writers",
"Conoce a los autores",
"Les rédacteurs",
"Die Autoren",
"Conheça os autores"
],
"home.writersNote": [
"Every help article is written by someone on the Mirage team.",
"Cada artículo de ayuda lo escribe alguien del equipo de Mirage.",
"Chaque article d'aide est rédigé par un membre de l'équipe Mirage.",
"Jeder Hilfeartikel stammt von jemandem aus dem Mirage-Team.",
"Cada artigo de ajuda é escrito por alguém da equipe Mirage."
],
"home.articlesN": [
"{n} help articles",
"{n} artículos de ayuda",
"{n} articles d'aide",
"{n} Hilfeartikel",
"{n} artigos de ajuda"
],
"home.ctaH": [
"Didn't find it?",
"¿No lo encuentras?",
"Introuvable ?",
"Nichts gefunden?",
"Não encontrou?"
],
"home.ctaP": [
"Send us a request and we'll pick it up from there.",
"Envíanos una solicitud y seguiremos desde ahí.",
"Envoyez-nous une demande et nous prendrons le relais.",
"Schick uns eine Anfrage, den Rest übernehmen wir.",
"Envie um pedido e continuamos a partir daí."
],
"home.ctaB": [
"Open a request",
"Abrir una solicitud",
"Ouvrir une demande",
"Anfrage erstellen",
"Abrir um pedido"
],
"cat.start.t": [
"Getting started",
"Primeros pasos",
"Premiers pas",
"Erste Schritte",
"Primeiros passos"
],
"cat.start.d": [
"Make an account and send your first request",
"Crea una cuenta y envía tu primera solicitud",
"Créez un compte et envoyez votre première demande",
"Konto erstellen und die erste Anfrage senden",
"Crie uma conta e envie seu primeiro pedido"
],
"cat.account.t": [
"Account & sign-in",
"Cuenta e inicio de sesión",
"Compte et connexion",
"Konto & Anmeldung",
"Conta e login"
],
"cat.account.d": [
"Verification, passwords and Discord login",
"Verificación, contraseñas e inicio con Discord",
"Vérification, mots de passe et connexion Discord",
"Bestätigung, Passwörter und Discord-Login",
"Verificação, senhas e login pelo Discord"
],
"cat.playing.t": [
"Playing & bugs",
"Jugar y errores",
"Jeu et bugs",
"Spielen & Bugs",
"Jogar e bugs"
],
"cat.playing.d": [
"Connecting, lag, skins and bug reports",
"Conexión, lag, skins y reportes de errores",
"Connexion, lag, skins et rapports de bugs",
"Verbindung, Lag, Skins und Bugmeldungen",
"Conexão, lag, skins e relatos de bugs"
],
"cat.applications.t": [
"Applications",
"Solicitudes de rol",
"Candidatures",
"Bewerbungen",
"Candidaturas"
],
"cat.applications.d": [
"Actor, Trusted and Builder roles",
"Roles de Actor, Trusted y Builder",
"Rôles Actor, Trusted et Builder",
"Actor-, Trusted- und Builder-Rollen",
"Cargos de Actor, Trusted e Builder"
],
"cat.reports.t": [
"Reports, appeals & safety",
"Reportes, apelaciones y seguridad",
"Signalements, appels et sécurité",
"Meldungen, Einsprüche & Sicherheit",
"Denúncias, recursos e segurança"
],
"cat.reports.d": [
"Reporting, appeals and avoiding scams",
"Reportar, apelar y evitar estafas",
"Signaler, faire appel et éviter les arnaques",
"Melden, Einspruch einlegen und Betrug vermeiden",
"Denunciar, recorrer e evitar golpes"
],
"art.by": [
"Written by",
"Escrito por",
"Rédigé par",
"Geschrieben von",
"Escrito por"
],
"art.team": [
"Mirage Support team",
"Equipo de soporte de Mirage",
"Équipe d'assistance Mirage",
"Mirage-Support-Team",
"Equipe de suporte Mirage"
],
"art.solved": [
"Did this solve it?",
"¿Esto lo resolvió?",
"Cela a-t-il résolu le problème ?",
"Hat das geholfen?",
"Isso resolveu?"
],
"art.yes": [
"Yes",
"Sí",
"Oui",
"Ja",
"Sim"
],
"art.no": [
"Not really",
"No del todo",
"Pas vraiment",
"Nicht wirklich",
"Não muito"
],
"art.thanks": [
"Glad that helped.",
"Me alegra que ayudara.",
"Ravi que cela ait aidé.",
"Schön, dass es geholfen hat.",
"Que bom que ajudou."
],
"art.sorry": [
"Sorry about that. A request will get a person on it.",
"Lo sentimos. Una solicitud pondrá a una persona a ayudarte.",
"Désolé. Une demande mettra quelqu'un sur le coup.",
"Das tut uns leid. Mit einer Anfrage kümmert sich ein Mensch darum.",
"Desculpe. Um pedido colocará uma pessoa para ajudar."
],
"art.stuck": [
"Still stuck?",
"¿Sigues atascado?",
"Toujours bloqué ?",
"Immer noch nicht gelöst?",
"Ainda com problemas?"
],
"art.related": [
"Related articles",
"Artículos relacionados",
"Articles associés",
"Verwandte Artikel",
"Artigos relacionados"
],
"art.nf": [
"We couldn't find that article",
"No pudimos encontrar ese artículo",
"Nous n'avons pas trouvé cet article",
"Wir haben diesen Artikel nicht gefunden",
"Não encontramos esse artigo"
],
"art.nfp": [
"The link may be old or mistyped. Try searching, or browse a category.",
"El enlace puede ser antiguo o tener un error. Prueba a buscar o explora una categoría.",
"Le lien est peut-être ancien ou erroné. Essayez la recherche ou parcourez une catégorie.",
"Der Link ist vielleicht veraltet oder falsch. Nutze die Suche oder stöbere in einer Kategorie.",
"O link pode estar antigo ou errado. Tente pesquisar ou navegue por uma categoria."
],
"art.search": [
"Search articles",
"Buscar artículos",
"Rechercher des articles",
"Artikel suchen",
"Pesquisar artigos"
],
"art.enOnly": [
"This article is available in English only for now.",
"Este artículo solo está disponible en inglés por ahora.",
"Cet article n'est disponible qu'en anglais pour le moment.",
"Dieser Artikel ist vorerst nur auf Englisch verfügbar.",
"Este artigo está disponível apenas em inglês por enquanto."
],
"pal.ph": [
"Search help articles…",
"Buscar artículos de ayuda…",
"Rechercher dans l'aide…",
"Hilfeartikel durchsuchen…",
"Pesquisar artigos de ajuda…"
],
"pal.none": [
"Nothing found.",
"No se encontró nada.",
"Aucun résultat.",
"Nichts gefunden.",
"Nada encontrado."
],
"pal.open": [
"Open a request instead",
"Abre una solicitud",
"Ouvrez plutôt une demande",
"Erstelle stattdessen eine Anfrage",
"Abra um pedido"
],
"pal.by": [
"by",
"por",
"par",
"von",
"por"
],
"dash.eyebrow": [
"PLAYER PORTAL",
"PORTAL DEL JUGADOR",
"PORTAIL JOUEUR",
"SPIELERPORTAL",
"PORTAL DO JOGADOR"
],
"dash.h1": [
"Your support tickets",
"Tus tickets de soporte",
"Vos tickets d'assistance",
"Deine Support-Tickets",
"Seus tickets de suporte"
],
"dash.sub": [
"Open a ticket or continue a conversation with our team.",
"Abre un ticket o continúa una conversación con nuestro equipo.",
"Ouvrez un ticket ou poursuivez une conversation avec notre équipe.",
"Erstelle ein Ticket oder setze ein Gespräch mit unserem Team fort.",
"Abra um ticket ou continue uma conversa com nossa equipe."
],
"dash.staffLink": [
"Staff dashboard",
"Panel del staff",
"Tableau du staff",
"Team-Dashboard",
"Painel da equipe"
],
"dash.signout": [
"Sign out",
"Cerrar sesión",
"Se déconnecter",
"Abmelden",
"Sair"
],
"live.on": [
"Live",
"En vivo",
"En direct",
"Live",
"Ao vivo"
],
"live.off": [
"Reconnecting…",
"Reconectando…",
"Reconnexion…",
"Verbindung wird wiederhergestellt…",
"Reconectando…"
],
"live.connecting": [
"Connecting…",
"Conectando…",
"Connexion…",
"Verbinde…",
"Conectando…"
],
"bell.default": [
"🔔 Notify me of replies",
"🔔 Avisarme de respuestas",
"🔔 Me notifier des réponses",
"🔔 Bei Antworten benachrichtigen",
"🔔 Avisar sobre respostas"
],
"bell.on": [
"🔔 Notifications on",
"🔔 Notificaciones activadas",
"🔔 Notifications activées",
"🔔 Benachrichtigungen an",
"🔔 Notificações ativadas"
],
"bell.blocked": [
"🔕 Blocked in browser",
"🔕 Bloqueadas en el navegador",
"🔕 Bloquées par le navigateur",
"🔕 Im Browser blockiert",
"🔕 Bloqueadas no navegador"
],
"new.title": [
"Start a support request",
"Iniciar una solicitud de soporte",
"Démarrer une demande d'assistance",
"Support-Anfrage starten",
"Iniciar um pedido de suporte"
],
"new.pick": [
"What do you need help with? Pick the closest topic and we'll ask for the right details.",
"¿Con qué necesitas ayuda? Elige el tema más cercano y te pediremos los datos adecuados.",
"De quoi avez-vous besoin ? Choisissez le sujet le plus proche et nous demanderons les bons détails.",
"Wobei brauchst du Hilfe? Wähle das passendste Thema, wir fragen die richtigen Details ab.",
"Com o que você precisa de ajuda? Escolha o tema mais próximo e pediremos os detalhes certos."
],
"new.topicGroup": [
"Choose a topic",
"Elige un tema",
"Choisissez un sujet",
"Thema wählen",
"Escolha um tema"
],
"new.change": [
"← Change topic",
"← Cambiar tema",
"← Changer de sujet",
"← Thema ändern",
"← Mudar tema"
],
"new.subject": [
"Subject",
"Asunto",
"Objet",
"Betreff",
"Assunto"
],
"new.subjectPh": [
"A short summary of the problem",
"Un resumen breve del problema",
"Un bref résumé du problème",
"Eine kurze Zusammenfassung des Problems",
"Um resumo curto do problema"
],
"new.msg": [
"Message",
"Mensaje",
"Message",
"Nachricht",
"Mensagem"
],
"new.attach": [
"Attach an image (optional)",
"Adjuntar una imagen (opcional)",
"Joindre une image (facultatif)",
"Bild anhängen (optional)",
"Anexar uma imagem (opcional)"
],
"new.hint": [
"Screenshots help us investigate. PNG, JPG, WEBP or GIF · max 5 MB. You can have up to 3 open requests at once.",
"Las capturas nos ayudan a investigar. PNG, JPG, WEBP o GIF · máx. 5 MB. Puedes tener hasta 3 solicitudes abiertas a la vez.",
"Les captures nous aident à enquêter. PNG, JPG, WEBP ou GIF · 5 Mo max. Vous pouvez avoir 3 demandes ouvertes à la fois.",
"Screenshots helfen uns bei der Untersuchung. PNG, JPG, WEBP oder GIF · max. 5 MB. Du kannst bis zu 3 offene Anfragen haben.",
"Capturas de tela ajudam na investigação. PNG, JPG, WEBP ou GIF · máx. 5 MB. Você pode ter até 3 pedidos abertos ao mesmo tempo."
],
"new.submit": [
"Submit request",
"Enviar solicitud",
"Envoyer la demande",
"Anfrage senden",
"Enviar pedido"
],
"sugg.title": [
"These might solve it already",
"Esto podría resolverlo ya",
"Cela pourrait déjà résoudre le problème",
"Das könnte schon helfen",
"Isto pode já resolver"
],
"list.title": [
"Your tickets",
"Tus tickets",
"Vos tickets",
"Deine Tickets",
"Seus tickets"
],
"list.private": [
"PRIVATE TO YOUR ACCOUNT",
"PRIVADO EN TU CUENTA",
"PRIVÉ, LIÉ À VOTRE COMPTE",
"NUR FÜR DEIN KONTO SICHTBAR",
"PRIVADO DA SUA CONTA"
],
"list.sub": [
"Select a request to review replies, add evidence or send an update.",
"Selecciona una solicitud para ver respuestas, añadir pruebas o enviar una actualización.",
"Sélectionnez une demande pour voir les réponses, ajouter des preuves ou envoyer une mise à jour.",
"Wähle eine Anfrage, um Antworten zu lesen, Beweise hinzuzufügen oder ein Update zu senden.",
"Selecione um pedido para ver respostas, adicionar provas ou enviar uma atualização."
],
"list.loading": [
"Loading tickets…",
"Cargando tickets…",
"Chargement des tickets…",
"Tickets werden geladen…",
"Carregando tickets…"
],
"detail.eyebrow": [
"TICKET DETAILS",
"DETALLES DEL TICKET",
"DÉTAILS DU TICKET",
"TICKET-DETAILS",
"DETALHES DO TICKET"
],
"detail.export": [
"Download transcript",
"Descargar transcripción",
"Télécharger la transcription",
"Verlauf herunterladen",
"Baixar transcrição"
],
"detail.close": [
"Close request",
"Cerrar solicitud",
"Fermer la demande",
"Anfrage schließen",
"Fechar pedido"
],
"detail.helped": [
"Did we help?",
"¿Te ayudamos?",
"Avons-nous aidé ?",
"Konnten wir helfen?",
"Ajudamos?"
],
"detail.optional": [
"(optional)",
"(opcional)",
"(facultatif)",
"(optional)",
"(opcional)"
],
"detail.rateGroup": [
"Rate the help you received",
"Valora la ayuda recibida",
"Évaluez l'aide reçue",
"Bewerte die erhaltene Hilfe",
"Avalie a ajuda recebida"
],
"detail.yes": [
"👍 Yes",
"👍 Sí",
"👍 Oui",
"👍 Ja",
"👍 Sim"
],
"detail.no": [
"👎 Not really",
"👎 No del todo",
"👎 Pas vraiment",
"👎 Nicht wirklich",
"👎 Não muito"
],
"detail.better": [
"Anything we could do better?",
"¿Algo que podamos mejorar?",
"Quelque chose à améliorer ?",
"Können wir etwas besser machen?",
"Algo que possamos melhorar?"
],
"detail.cancel": [
"Cancel",
"Cancelar",
"Annuler",
"Abbrechen",
"Cancelar"
],
"detail.howdid": [
"How did we do?",
"¿Cómo lo hicimos?",
"Comment avons-nous fait ?",
"Wie haben wir das gemacht?",
"Como nos saímos?"
],
"detail.sendFb": [
"Send feedback",
"Enviar opinión",
"Envoyer l'avis",
"Feedback senden",
"Enviar avaliação"
],
"detail.closedNote": [
"This ticket is closed. If you still need help, open a new request.",
"Este ticket está cerrado. Si aún necesitas ayuda, abre una nueva solicitud.",
"Ce ticket est fermé. Si vous avez encore besoin d'aide, ouvrez une nouvelle demande.",
"Dieses Ticket ist geschlossen. Brauchst du noch Hilfe, erstelle eine neue Anfrage.",
"Este ticket está fechado. Se ainda precisar de ajuda, abra um novo pedido."
],
"detail.reply": [
"Reply",
"Responder",
"Répondre",
"Antworten",
"Responder"
],
"detail.replyPh": [
"Write a helpful reply…",
"Escribe una respuesta útil…",
"Écrivez une réponse utile…",
"Schreibe eine hilfreiche Antwort…",
"Escreva uma resposta útil…"
],
"detail.imgOnly": [
"Images only, maximum 5 MB per message.",
"Solo imágenes, máximo 5 MB por mensaje.",
"Images uniquement, 5 Mo maximum par message.",
"Nur Bilder, maximal 5 MB pro Nachricht.",
"Somente imagens, máximo de 5 MB por mensagem."
],
"detail.send": [
"Send reply →",
"Enviar respuesta →",
"Envoyer la réponse →",
"Antwort senden →",
"Enviar resposta →"
],
"detail.handled": [
"Being handled by {name}",
"Atendido por {name}",
"Pris en charge par {name}",
"Wird bearbeitet von {name}",
"Atendido por {name}"
],
"msg.you": [
"You",
"Tú",
"Vous",
"Du",
"Você"
],
"msg.team": [
"Mirage Support Team",
"Equipo de soporte de Mirage",
"Équipe d'assistance Mirage",
"Mirage-Support-Team",
"Equipe de suporte Mirage"
],
"msg.staff": [
"Staff",
"Staff",
"Staff",
"Team",
"Equipe"
],
"msg.attached": [
"Attached an image",
"Adjuntó una imagen",
"Image jointe",
"Bild angehängt",
"Imagem anexada"
],
"msg.view": [
"View attachment ↗",
"Ver adjunto ↗",
"Voir la pièce jointe ↗",
"Anhang ansehen ↗",
"Ver anexo ↗"
],
"msg.unavail": [
"Attachment is currently unavailable.",
"El adjunto no está disponible ahora.",
"La pièce jointe est indisponible.",
"Der Anhang ist derzeit nicht verfügbar.",
"O anexo está indisponível no momento."
],
"msg.rated": [
"You rated this request {v}",
"Valoraste esta solicitud {v}",
"Vous avez évalué cette demande {v}",
"Du hast diese Anfrage mit {v} bewertet",
"Você avaliou este pedido {v}"
],
"st.open": [
"open",
"abierto",
"ouvert",
"offen",
"aberto"
],
"st.in_progress": [
"in progress",
"en curso",
"en cours",
"in Bearbeitung",
"em andamento"
],
"st.closed": [
"closed",
"cerrado",
"fermé",
"geschlossen",
"fechado"
],
"act.creating": [
"Creating request…",
"Creando solicitud…",
"Création de la demande…",
"Anfrage wird erstellt…",
"Criando pedido…"
],
"act.sending": [
"Sending reply…",
"Enviando respuesta…",
"Envoi de la réponse…",
"Antwort wird gesendet…",
"Enviando resposta…"
],
"act.saving": [
"Saving…",
"Guardando…",
"Enregistrement…",
"Speichern…",
"Salvando…"
],
"ok.created": [
"Your support request has been created.",
"Tu solicitud de soporte fue creada.",
"Votre demande d'assistance a été créée.",
"Deine Support-Anfrage wurde erstellt.",
"Seu pedido de suporte foi criado."
],
"ok.sent": [
"Reply sent successfully.",
"Respuesta enviada correctamente.",
"Réponse envoyée.",
"Antwort gesendet.",
"Resposta enviada com sucesso."
],
"ok.thanksFb": [
"Thanks for the feedback.",
"Gracias por tu opinión.",
"Merci pour votre avis.",
"Danke für dein Feedback.",
"Obrigado pelo feedback."
],
"ok.closed": [
"Request closed. Thanks for letting us know.",
"Solicitud cerrada. Gracias por avisarnos.",
"Demande fermée. Merci de nous avoir prévenus.",
"Anfrage geschlossen. Danke für die Rückmeldung.",
"Pedido fechado. Obrigado por nos avisar."
],
"err.topic": [
"Choose a topic first.",
"Primero elige un tema.",
"Choisissez d'abord un sujet.",
"Wähle zuerst ein Thema.",
"Escolha um tema primeiro."
],
"err.subject": [
"Add a subject with at least 3 characters.",
"Añade un asunto de al menos 3 caracteres.",
"Ajoutez un objet d'au moins 3 caractères.",
"Gib einen Betreff mit mindestens 3 Zeichen ein.",
"Adicione um assunto com pelo menos 3 caracteres."
],
"err.body": [
"Tell us what happened before submitting your ticket.",
"Cuéntanos qué pasó antes de enviar el ticket.",
"Dites-nous ce qui s'est passé avant d'envoyer.",
"Erzähl uns vor dem Absenden, was passiert ist.",
"Conte o que aconteceu antes de enviar."
],
"err.reply": [
"Write a reply or attach an image.",
"Escribe una respuesta o adjunta una imagen.",
"Écrivez une réponse ou joignez une image.",
"Schreibe eine Antwort oder hänge ein Bild an.",
"Escreva uma resposta ou anexe uma imagem."
],
"err.image": [
"Please choose a PNG, JPG, WEBP or GIF image.",
"Elige una imagen PNG, JPG, WEBP o GIF.",
"Choisissez une image PNG, JPG, WEBP ou GIF.",
"Wähle ein PNG-, JPG-, WEBP- oder GIF-Bild.",
"Escolha uma imagem PNG, JPG, WEBP ou GIF."
],
"err.size": [
"Images must be 5 MB or smaller.",
"Las imágenes deben pesar 5 MB o menos.",
"Les images doivent faire 5 Mo ou moins.",
"Bilder dürfen höchstens 5 MB groß sein.",
"As imagens devem ter 5 MB ou menos."
],
"err.rate": [
"Choose 👍 or 👎 to send feedback.",
"Elige 👍 o 👎 para enviar tu opinión.",
"Choisissez 👍 ou 👎 pour envoyer votre avis.",
"Wähle 👍 oder 👎, um Feedback zu senden.",
"Escolha 👍 ou 👎 para enviar o feedback."
],
"notif.reply": [
"Mirage Support replied",
"Soporte de Mirage respondió",
"L'assistance Mirage a répondu",
"Mirage Support hat geantwortet",
"O suporte Mirage respondeu"
],
"notif.in": [
"New reply from Mirage Support on “{s}”.",
"Nueva respuesta de soporte en «{s}».",
"Nouvelle réponse de l'assistance sur « {s} ».",
"Neue Antwort vom Support zu „{s}“.",
"Nova resposta do suporte em “{s}”."
],
"login.h1": [
"One place for support.",
"Un solo lugar para el soporte.",
"Un seul endroit pour l'assistance.",
"Ein Ort für Support.",
"Um só lugar para o suporte."
],
"login.p": [
"Open a ticket, add screenshots, and check back whenever you need.",
"Abre un ticket, añade capturas y vuelve cuando quieras.",
"Ouvrez un ticket, ajoutez des captures et revenez quand vous voulez.",
"Erstelle ein Ticket, füge Screenshots hinzu und schau jederzeit wieder vorbei.",
"Abra um ticket, adicione capturas de tela e volte quando quiser."
],
"login.tabUp": [
"Create account",
"Crear cuenta",
"Créer un compte",
"Konto erstellen",
"Criar conta"
],
"login.email": [
"Email address",
"Correo electrónico",
"Adresse e-mail",
"E-Mail-Adresse",
"Endereço de e-mail"
],
"login.pass": [
"Password",
"Contraseña",
"Mot de passe",
"Passwort",
"Senha"
],
"login.passPhIn": [
"Your password",
"Tu contraseña",
"Votre mot de passe",
"Dein Passwort",
"Sua senha"
],
"login.passPhUp": [
"At least 8 characters",
"Al menos 8 caracteres",
"Au moins 8 caractères",
"Mindestens 8 Zeichen",
"Pelo menos 8 caracteres"
],
"login.forgot": [
"Forgot password?",
"¿Olvidaste tu contraseña?",
"Mot de passe oublié ?",
"Passwort vergessen?",
"Esqueceu a senha?"
],
"login.user": [
"Username",
"Nombre de usuario",
"Nom d'utilisateur",
"Benutzername",
"Nome de usuário"
],
"login.userPh": [
"Your player name",
"Tu nombre de jugador",
"Votre pseudo",
"Dein Spielername",
"Seu nome de jogador"
],
"login.userHint": [
"Use 3–24 letters, numbers or underscores.",
"Usa de 3 a 24 letras, números o guiones bajos.",
"3 à 24 lettres, chiffres ou tirets bas.",
"3–24 Buchstaben, Zahlen oder Unterstriche.",
"Use de 3 a 24 letras, números ou sublinhados."
],
"login.passHint": [
"Use at least 8 characters. You may need to verify your email before signing in.",
"Usa al menos 8 caracteres. Quizá debas verificar tu correo antes de entrar.",
"Au moins 8 caractères. Vous devrez peut-être vérifier votre e-mail avant de vous connecter.",
"Mindestens 8 Zeichen. Eventuell musst du deine E-Mail bestätigen, bevor du dich anmeldest.",
"Use pelo menos 8 caracteres. Talvez seja preciso verificar seu e-mail antes de entrar."
],
"login.or": [
"OR CONTINUE WITH",
"O CONTINÚA CON",
"OU CONTINUER AVEC",
"ODER WEITER MIT",
"OU CONTINUE COM"
],
"login.discord": [
"Continue with Discord",
"Continuar con Discord",
"Continuer avec Discord",
"Weiter mit Discord",
"Continuar com o Discord"
],
"login.fine": [
"By continuing, you agree to use the support system respectfully. Never share your password with staff.",
"Al continuar, aceptas usar el sistema de soporte con respeto. Nunca compartas tu contraseña con el staff.",
"En continuant, vous acceptez d'utiliser l'assistance avec respect. Ne partagez jamais votre mot de passe avec le staff.",
"Wenn du fortfährst, versprichst du, das Support-System respektvoll zu nutzen. Teile dein Passwort nie mit dem Team.",
"Ao continuar, você concorda em usar o suporte com respeito. Nunca compartilhe sua senha com a equipe."
],
"tp.account.b": [
"Sign-in, verification, email or username",
"Inicio de sesión, verificación, correo o usuario",
"Connexion, vérification, e-mail ou pseudo",
"Anmeldung, Bestätigung, E-Mail oder Benutzername",
"Login, verificação, e-mail ou usuário"
],
"tp.ingame.t": [
"Problem in game",
"Problema en el juego",
"Problème en jeu",
"Problem im Spiel",
"Problema no jogo"
],
"tp.ingame.b": [
"Something went wrong while playing",
"Algo salió mal mientras jugabas",
"Un problème est survenu en jouant",
"Beim Spielen ist etwas schiefgelaufen",
"Algo deu errado enquanto jogava"
],
"tp.bug.t": [
"Report a bug",
"Reportar un error",
"Signaler un bug",
"Bug melden",
"Relatar um bug"
],
"tp.bug.b": [
"Something broken you can repeat",
"Algo roto que puedes repetir",
"Un problème reproductible",
"Etwas Kaputtes, das sich wiederholen lässt",
"Algo quebrado que você consegue repetir"
],
"tp.report.t": [
"Report a player",
"Reportar a un jugador",
"Signaler un joueur",
"Spieler melden",
"Denunciar um jogador"
],
"tp.report.b": [
"Tell us about a rule concern",
"Cuéntanos sobre un problema con las reglas",
"Signalez un souci de règlement",
"Melde ein Problem mit den Regeln",
"Conte sobre um problema com as regras"
],
"tp.appeal.t": [
"Appeal a punishment",
"Apelar una sanción",
"Faire appel d'une sanction",
"Strafe anfechten",
"Recorrer de uma punição"
],
"tp.appeal.b": [
"Ask for a ban or mute to be reviewed",
"Pide que se revise un ban o mute",
"Demandez la révision d'un ban ou mute",
"Bitte um Prüfung eines Banns oder Mutes",
"Peça a revisão de um ban ou mute"
],
"tp.general.t": [
"Something else",
"Otra cosa",
"Autre chose",
"Etwas anderes",
"Outra coisa"
],
"tp.general.b": [
"Questions and anything that doesn't fit",
"Preguntas y lo que no encaje",
"Questions et tout le reste",
"Fragen und alles, was sonst nicht passt",
"Dúvidas e o que não se encaixar"
],
"f.task": [
"What are you trying to do?",
"¿Qué intentas hacer?",
"Que essayez-vous de faire ?",
"Was möchtest du tun?",
"O que você está tentando fazer?"
],
"f.method": [
"How did you sign up?",
"¿Cómo te registraste?",
"Comment vous êtes-vous inscrit ?",
"Wie hast du dich registriert?",
"Como você se cadastrou?"
],
"f.ign": [
"Your Minecraft username",
"Tu usuario de Minecraft",
"Votre pseudo Minecraft",
"Dein Minecraft-Name",
"Seu nome no Minecraft"
],
"f.when": [
"When did it happen?",
"¿Cuándo ocurrió?",
"Quand cela s'est-il produit ?",
"Wann ist es passiert?",
"Quando aconteceu?"
],
"f.steps": [
"Steps to repeat it",
"Pasos para repetirlo",
"Étapes pour le reproduire",
"Schritte zum Nachstellen",
"Passos para repetir"
],
"f.expected": [
"What you expected to happen",
"Lo que esperabas que pasara",
"Ce que vous attendiez",
"Was du erwartet hast",
"O que você esperava que acontecesse"
],
"f.often": [
"How often does it happen?",
"¿Con qué frecuencia ocurre?",
"À quelle fréquence cela arrive-t-il ?",
"Wie oft passiert es?",
"Com que frequência acontece?"
],
"f.target": [
"Player's username",
"Usuario del jugador",
"Pseudo du joueur",
"Name des Spielers",
"Nome do jogador"
],
"f.rule": [
"Which rule do you think was broken?",
"¿Qué regla crees que se rompió?",
"Quelle règle a été enfreinte selon vous ?",
"Welche Regel wurde deiner Meinung nach verletzt?",
"Qual regra você acha que foi quebrada?"
],
"f.kind": [
"What was the punishment?",
"¿Cuál fue la sanción?",
"Quelle était la sanction ?",
"Was war die Strafe?",
"Qual foi a punição?"
],
"f.reason": [
"Reason you were given",
"Motivo que te dieron",
"Motif indiqué",
"Genannter Grund",
"Motivo informado"
],
"f.choose": [
"Choose…",
"Elige…",
"Choisir…",
"Auswählen…",
"Escolher…"
],
"b.account": [
"What's happening?",
"¿Qué está pasando?",
"Que se passe-t-il ?",
"Was passiert gerade?",
"O que está acontecendo?"
],
"b.ingame": [
"What happened?",
"¿Qué pasó?",
"Que s'est-il passé ?",
"Was ist passiert?",
"O que aconteceu?"
],
"b.bug": [
"What actually happened?",
"¿Qué pasó en realidad?",
"Que s'est-il réellement passé ?",
"Was ist tatsächlich passiert?",
"O que realmente aconteceu?"
],
"b.appeal": [
"Why should this be reviewed?",
"¿Por qué debería revisarse?",
"Pourquoi faut-il réexaminer ?",
"Warum sollte das geprüft werden?",
"Por que isso deve ser revisado?"
],
"b.general": [
"How can we help?",
"¿Cómo podemos ayudar?",
"Comment pouvons-nous aider ?",
"Wie können wir helfen?",
"Como podemos ajudar?"
],
"o.verify": [
"Verify my email",
"Verificar mi correo",
"Vérifier mon e-mail",
"Meine E-Mail bestätigen",
"Verificar meu e-mail"
],
"o.reset": [
"Reset my password",
"Restablecer mi contraseña",
"Réinitialiser mon mot de passe",
"Mein Passwort zurücksetzen",
"Redefinir minha senha"
],
"o.change": [
"Change my email or username",
"Cambiar mi correo o usuario",
"Changer mon e-mail ou pseudo",
"E-Mail oder Benutzernamen ändern",
"Alterar meu e-mail ou usuário"
],
"o.emailpw": [
"Email and password",
"Correo y contraseña",
"E-mail et mot de passe",
"E-Mail und Passwort",
"E-mail e senha"
],
"o.discord": [
"Discord",
"Discord",
"Discord",
"Discord",
"Discord"
],
"o.notsure": [
"Not sure",
"No estoy seguro",
"Pas sûr",
"Nicht sicher",
"Não tenho certeza"
],
"o.every": [
"Every time",
"Siempre",
"À chaque fois",
"Jedes Mal",
"Sempre"
],
"o.some": [
"Sometimes",
"A veces",
"Parfois",
"Manchmal",
"Às vezes"
],
"o.once": [
"Only once",
"Solo una vez",
"Une seule fois",
"Nur einmal",
"Só uma vez"
],
"o.ban": [
"Ban",
"Ban",
"Bannissement",
"Bann",
"Ban"
],
"o.mute": [
"Mute",
"Mute",
"Mute",
"Mute",
"Mute"
],
"o.kick": [
"Kick",
"Kick",
"Expulsion",
"Kick",
"Kick"
],
"o.warn": [
"Warning",
"Advertencia",
"Avertissement",
"Verwarnung",
"Aviso"
],
"set.eyebrow": [
"Your account",
"Tu cuenta",
"Votre compte",
"Dein Konto",
"Sua conta"
],
"set.h1": [
"Settings",
"Ajustes",
"Paramètres",
"Einstellungen",
"Configurações"
],
"set.lead": [
"Make Mirage Support yours. Changes apply instantly, and follow you across devices when you're signed in.",
"Haz tuyo Mirage Support. Los cambios se aplican al instante y te siguen entre dispositivos si has iniciado sesión.",
"Personnalisez Mirage Support. Les changements s'appliquent immédiatement et vous suivent d'un appareil à l'autre une fois connecté.",
"Mach Mirage Support zu deinem. Änderungen gelten sofort und folgen dir auf alle Geräte, wenn du angemeldet bist.",
"Deixe o Mirage Support com a sua cara. As mudanças valem na hora e acompanham você em todos os dispositivos quando está conectado."
],
"set.s.appearance": [
"Appearance",
"Apariencia",
"Apparence",
"Darstellung",
"Aparência"
],
"set.s.language": [
"Language",
"Idioma",
"Langue",
"Sprache",
"Idioma"
],
"set.s.notifications": [
"Notifications",
"Notificaciones",
"Notifications",
"Benachrichtigungen",
"Notificações"
],
"set.s.comfort": [
"Comfort & motion",
"Comodidad y movimiento",
"Confort et animations",
"Komfort & Bewegung",
"Conforto e movimento"
],
"set.s.account": [
"Account",
"Cuenta",
"Compte",
"Konto",
"Conta"
],
"set.theme": [
"Theme",
"Tema",
"Thème",
"Design",
"Tema"
],
"set.theme.auto": [
"Auto",
"Auto",
"Auto",
"Auto",
"Auto"
],
"set.theme.light": [
"Light",
"Claro",
"Clair",
"Hell",
"Claro"
],
"set.theme.dark": [
"Dark",
"Oscuro",
"Sombre",
"Dunkel",
"Escuro"
],
"set.accent": [
"Accent colour",
"Color de acento",
"Couleur d'accent",
"Akzentfarbe",
"Cor de destaque"
],
"acc.cyan": [
"Mirage cyan",
"Cian Mirage",
"Cyan Mirage",
"Mirage-Cyan",
"Ciano Mirage"
],
"acc.violet": [
"Dusk violet",
"Violeta del ocaso",
"Violet crépuscule",
"Dämmerungs-Violett",
"Violeta do entardecer"
],
"acc.mint": [
"Oasis mint",
"Menta del oasis",
"Menthe oasis",
"Oasen-Mint",
"Menta do oásis"
],
"acc.rose": [
"Ember rose",
"Rosa brasa",
"Rose braise",
"Glut-Rosé",
"Rosa brasa"
],
"acc.gold": [
"Desert gold",
"Oro del desierto",
"Or du désert",
"Wüstengold",
"Ouro do deserto"
],
"set.size": [
"Text size",
"Tamaño del texto",
"Taille du texte",
"Textgröße",
"Tamanho do texto"
],
"set.size.hint": [
"Makes help articles and forms easier to read.",
"Hace más fáciles de leer los artículos y formularios.",
"Rend articles et formulaires plus lisibles.",
"Macht Artikel und Formulare besser lesbar.",
"Facilita a leitura de artigos e formulários."
],
"set.density": [
"Density",
"Densidad",
"Densité",
"Dichte",
"Densidade"
],
"set.dens.0": [
"Compact",
"Compacta",
"Compacte",
"Kompakt",
"Compacta"
],
"set.dens.1": [
"Comfy",
"Cómoda",
"Confortable",
"Bequem",
"Confortável"
],
"set.dens.2": [
"Roomy",
"Amplia",
"Aérée",
"Geräumig",
"Espaçosa"
],
"set.hour": [
"Time format",
"Formato de hora",
"Format de l'heure",
"Zeitformat",
"Formato de hora"
],
"set.hour.auto": [
"Auto",
"Auto",
"Auto",
"Auto",
"Auto"
],
"set.hour.12": [
"12-hour",
"12 horas",
"12 heures",
"12 Std.",
"12 horas"
],
"set.hour.24": [
"24-hour",
"24 horas",
"24 heures",
"24 Std.",
"24 horas"
],
"set.hour.preview": [
"Time preview (example: 2:05 PM / 14:05)",
"Vista previa de hora (ejemplo: 14:05)",
"Aperçu de l’heure (exemple : 14:05)",
"Zeitvorschau (Beispiel: 14:05)",
"Prévia da hora (exemplo: 14:05)"
],
"set.lang.hint": [
"Changes the whole interface. Help article text stays in English for now.",
"Cambia toda la interfaz. El texto de los artículos sigue en inglés por ahora.",
"Change toute l'interface. Le texte des articles reste en anglais pour l'instant.",
"Ändert die gesamte Oberfläche. Artikeltexte bleiben vorerst auf Englisch.",
"Muda toda a interface. O texto dos artigos continua em inglês por enquanto."
],
"set.notif": [
"Browser notifications",
"Notificaciones del navegador",
"Notifications du navigateur",
"Browser-Benachrichtigungen",
"Notificações do navegador"
],
"set.notif.hint": [
"A pop-up when staff reply, while this page is open.",
"Un aviso cuando el staff responde, mientras esta página esté abierta.",
"Une alerte quand le staff répond, tant que cette page est ouverte.",
"Ein Pop-up, wenn das Team antwortet, solange diese Seite offen ist.",
"Um aviso quando a equipe responde, enquanto esta página estiver aberta."
],
"set.email": [
"Email me when staff reply",
"Enviarme un correo cuando el staff responda",
"M'envoyer un e-mail quand le staff répond",
"Per E-Mail benachrichtigen, wenn das Team antwortet",
"Enviar e-mail quando a equipe responder"
],
"set.email.hint": [
"Sent to your account email.",
"Se envía al correo de tu cuenta.",
"Envoyé à l'e-mail de votre compte.",
"Geht an die E-Mail-Adresse deines Kontos.",
"Enviado para o e-mail da sua conta."
],
"set.sound": [
"Reply sound",
"Sonido de respuesta",
"Son de réponse",
"Antwortton",
"Som de resposta"
],
"set.sound.hint": [
"A soft chime when a new reply arrives.",
"Un tono suave cuando llega una respuesta.",
"Un léger carillon à chaque nouvelle réponse.",
"Ein sanfter Klang bei neuen Antworten.",
"Um som suave quando chega uma resposta."
],
"set.volume": [
"Volume",
"Volumen",
"Volume",
"Lautstärke",
"Volume"
],
"set.motion": [
"Animation",
"Animación",
"Animation",
"Animation",
"Animação"
],
"set.motion.hint": [
"Dial down the heat-haze and movement across the site.",
"Reduce el efecto de calor y el movimiento en todo el sitio.",
"Réduit l'effet de mirage et les mouvements sur le site.",
"Reduziert den Hitzeflimmer-Effekt und Bewegungen auf der Seite.",
"Reduz o efeito de miragem e os movimentos no site."
],
"set.mo.0": [
"Off",
"Apagada",
"Désactivée",
"Aus",
"Desligada"
],
"set.mo.1": [
"Subtle",
"Sutil",
"Discrète",
"Dezent",
"Sutil"
],
"set.mo.2": [
"Full",
"Completa",
"Complète",
"Voll",
"Completa"
],
"set.display": [
"Display name",
"Nombre visible",
"Nom affiché",
"Anzeigename",
"Nome de exibição"
],
"set.display.hint": [
"Shown to staff on the requests you open.",
"Lo ve el staff en las solicitudes que abras.",
"Visible par le staff sur vos demandes.",
"Wird dem Team bei deinen Anfragen angezeigt.",
"Aparece para a equipe nos pedidos que você abrir."
],
"set.signin": [
"Sign in to sync these settings across your devices.",
"Inicia sesión para sincronizar estos ajustes entre tus dispositivos.",
"Connectez-vous pour synchroniser ces paramètres entre vos appareils.",
"Melde dich an, um diese Einstellungen auf allen Geräten zu synchronisieren.",
"Entre para sincronizar estas configurações entre seus dispositivos."
],
"set.reset": [
"Reset to defaults",
"Restablecer valores",
"Réinitialiser",
"Zurücksetzen",
"Restaurar padrões"
],
"set.saved": [
"Saved",
"Guardado",
"Enregistré",
"Gespeichert",
"Salvo"
],
"set.local": [
"Saved on this device",
"Guardado en este dispositivo",
"Enregistré sur cet appareil",
"Auf diesem Gerät gespeichert",
"Salvo neste dispositivo"
],
"set.preview": [
"Preview",
"Vista previa",
"Aperçu",
"Vorschau",
"Pré-visualização"
],
"set.prevTitle": [
"Can't join the server",
"No puedo conectarme al servidor",
"Impossible de rejoindre le serveur",
"Kann dem Server nicht beitreten",
"Não consigo entrar no servidor"
],
"set.prevBody": [
"Thanks for the details. Could you tell us what error you see?",
"Gracias por los detalles. ¿Nos dices qué error ves?",
"Merci pour les détails. Pouvez-vous nous dire quelle erreur s'affiche ?",
"Danke für die Details. Welchen Fehler siehst du?",
"Obrigado pelos detalhes. Pode nos dizer qual erro aparece?"
],
"tp.account.t": [
"Account & sign-in",
"Cuenta e inicio de sesión",
"Compte et connexion",
"Konto & Anmeldung",
"Conta e login"
]
};
export const lang = () => getPrefs().lang;
export function t(key, vars) {
  const row = T[key]; let s = row ? (row[LANGS.findIndex(l => l[0] === lang())] || row[0]) : key;
  if (vars) for (const k in vars) s = s.replaceAll("{" + k + "}", vars[k]);
  return s;
}
export function applyI18n(root = document) {
  document.documentElement.lang = lang();
  root.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  root.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
  root.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
}
export const KEYS = Object.keys(T);
