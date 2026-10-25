import { getPrefs } from "/prefs.js";
const L = {
es: {
"navGuides":"Guías","navTerms":"Términos","navPrivacy":"Privacidad","eyebrow":"POLÍTICAS DEL SITIO","privacy":"Política de privacidad","terms":"Términos y condiciones","updated":"Última actualización: 19 de octubre de 2026",
p:[
"Este aviso se aplica al portal de soporte support.miragesmp.org, no al sitio web principal de Mirage ni a los servicios de Minecraft o de la comunidad. Describe la información utilizada para gestionar las cuentas y los tickets de soporte; el operador debe mantenerlo actualizado según la configuración real.",
"Dirección de correo electrónico, identificador de cuenta y nombre de usuario; asuntos, categorías, mensajes y marcas de tiempo de los tickets; archivos adjuntos que subas; y registros técnicos o de seguridad generados por los proveedores del servicio.",
"Para autenticar cuentas, responder a solicitudes de soporte, conservar el historial de tickets, investigar errores o abusos y mantener la seguridad del servicio.",
"Las conversaciones de los tickets están destinadas a ser visibles para quien creó el ticket y para el personal de soporte autorizado. No incluyas contraseñas, códigos de recuperación, datos de pago ni información sensible innecesaria.",
"El sitio utiliza alojamiento web estático y Supabase para la autenticación, la base de datos de tickets y el almacenamiento privado de archivos adjuntos. Resend puede procesar direcciones de correo y contenido de mensajes para entregar correos de autenticación o notificaciones de tickets, según las funciones habilitadas. Estos proveedores procesan la información conforme a sus propios términos y avisos de privacidad.",
"La información puede conservarse durante el tiempo necesario para prestar soporte, mantener registros, resolver disputas o cumplir obligaciones legales. Ningún servicio en línea puede garantizar una seguridad absoluta.",
"Puedes contactar con el operador del sitio para solicitar acceso, rectificación o eliminación, sujeto a verificaciones de identidad, limitaciones técnicas y la legislación aplicable.",
"Esta política puede cambiar a medida que evolucione el servicio. Para consultas sobre privacidad, contacta con el operador a través de los canales oficiales de soporte de Mirage.",
"Esta es una política inicial, no asesoramiento jurídico. Antes de confiar en ella, el operador debe añadir los datos verificados del responsable y de contacto, las bases legales, los plazos de conservación, los detalles de transferencias internacionales y los derechos aplicables."
],
termsP:[
"Estas condiciones se aplican específicamente al sitio web de Mirage Support en support.miragesmp.org, incluidos sus artículos de ayuda, inicio de sesión, sistema de tickets, respuestas y archivos adjuntos. Son independientes de las condiciones y normas comunitarias del sitio principal de Mirage y de sus servicios de Minecraft/comunidad, publicados en miragesmp.org/legal.html. Al utilizar este portal, aceptas estas condiciones. Si no estás de acuerdo, no utilices el portal.",
"Debes proporcionar información de cuenta precisa y cumplir los requisitos de edad o consentimiento que correspondan. Si no tienes edad suficiente para consentir el tratamiento de tus datos conforme a la legislación aplicable, pide ayuda a tu padre, madre o tutor antes de crear una cuenta.",
"Utiliza el portal para consultas o informes legítimos relacionados con Mirage. No envíes spam, acoses, amenaces, suplantes a otras personas, presentes informes maliciosos o deliberadamente falsos, interfieras con el servicio, explotes vulnerabilidades ni intentes acceder a cuentas, tickets o archivos privados de otras personas.",
"Eres responsable de mantener seguras tus credenciales y tu cuenta de correo. No incluyas contraseñas, códigos de un solo uso, enlaces de restablecimiento ni otros secretos de cuenta en un ticket. Si sospechas que alguien ha accedido sin autorización, contacta con el equipo de soporte por un canal oficial.",
"Proporciona información clara y precisa que sea relevante para tu solicitud. Envía únicamente contenido que tengas permiso para compartir. No subas contenido ilegal, malware, amenazas ni material que exponga innecesariamente la información privada de otra persona. Los tickets y archivos adjuntos están destinados a ser visibles para quien creó el ticket y el personal autorizado. El personal puede categorizar, responder, reabrir, cerrar, rechazar o eliminar tickets cuando sea razonablemente necesario.",
"Enviar un ticket no garantiza un resultado concreto, una decisión de apelación ni un plazo de respuesta. El personal puede pedir más información o dirigirte a otro canal oficial. El uso abusivo puede limitar tu acceso al portal o dar lugar a otras medidas de moderación."
]},
fr: {
"navGuides":"Guides","navTerms":"Conditions","navPrivacy":"Confidentialité","eyebrow":"POLITIQUES DU SITE","privacy":"Politique de confidentialité","terms":"Conditions générales","updated":"Dernière mise à jour : 19 octobre 2026",
p:[
"Cette notice concerne le portail d’assistance support.miragesmp.org, et non le site principal de Mirage ni les services Minecraft ou communautaires. Elle décrit les informations utilisées pour gérer les comptes et les tickets d’assistance ; l’exploitant doit la maintenir conforme à la configuration réelle.",
"Adresse e-mail, identifiant de compte et nom d’utilisateur ; sujets, catégories, messages et horodatages des tickets ; pièces jointes envoyées ; journaux techniques ou de sécurité générés par les prestataires.",
"Pour authentifier les comptes, répondre aux demandes d’assistance, conserver l’historique des tickets, enquêter sur les bugs ou les abus et assurer la sécurité du service.",
"Les conversations sont destinées à être visibles par l’auteur du ticket et le personnel d’assistance autorisé. N’incluez pas de mots de passe, codes de récupération, données de paiement ou informations sensibles inutiles.",
"Le site utilise un hébergement statique et Supabase pour l’authentification, la base de données des tickets et le stockage privé des pièces jointes. Resend peut traiter les adresses e-mail et le contenu des messages pour envoyer des e-mails d’authentification ou des notifications, selon les fonctions activées. Ces prestataires appliquent leurs propres conditions et politiques de confidentialité.",
"Les informations peuvent être conservées aussi longtemps que nécessaire pour fournir l’assistance, tenir des dossiers, résoudre des litiges ou respecter la loi. Aucun service en ligne ne peut garantir une sécurité absolue.",
"Vous pouvez contacter l’exploitant pour demander l’accès, la rectification ou la suppression de vos informations, sous réserve de vérifications d’identité, de limites techniques et du droit applicable.",
"Cette politique peut évoluer avec le service. Pour toute question relative à la confidentialité, contactez l’exploitant via les canaux officiels d’assistance de Mirage.",
"Il s’agit d’une politique de départ, et non d’un conseil juridique. Avant de s’y fier, l’exploitant doit ajouter les coordonnées vérifiées du responsable, les bases légales, les durées de conservation, les informations sur les transferts internationaux et les droits applicables."
],
termsP:[
"Ces conditions s’appliquent spécifiquement au site Mirage Support support.miragesmp.org, y compris ses articles d’aide, la connexion, les tickets, les réponses et les pièces jointes. Elles sont distinctes des conditions et règles communautaires du site principal de Mirage et des services Minecraft/communautaires, publiées sur miragesmp.org/legal.html. En utilisant ce portail, vous acceptez ces conditions. Sinon, ne l’utilisez pas.",
"Vous devez fournir des informations exactes et respecter les exigences d’âge ou de consentement applicables. Si vous n’avez pas l’âge requis pour consentir au traitement de vos informations, demandez l’aide d’un parent ou tuteur avant de créer un compte.",
"Utilisez le portail pour des questions ou signalements légitimes concernant Mirage. N’envoyez pas de spam, ne harcelez ni ne menacez personne, n’usurpez pas d’identité, ne faites pas de signalements malveillants ou sciemment faux, ne perturbez pas le service et ne tentez pas d’accéder aux comptes, tickets ou pièces jointes privés d’autrui.",
"Vous êtes responsable de la sécurité de vos identifiants et de votre messagerie. Ne placez pas de mots de passe, codes à usage unique, liens de réinitialisation ou autres secrets dans un ticket. En cas de soupçon d’accès non autorisé, contactez l’assistance par un canal officiel.",
"Fournissez des informations claires et exactes pertinentes pour votre demande. Ne soumettez que du contenu que vous êtes autorisé à partager. N’envoyez pas de contenu illégal, de logiciel malveillant, de menaces ou d’informations privées d’autrui inutilement exposées. Les tickets et pièces jointes sont destinés à l’auteur et au personnel autorisé. Le personnel peut classer, traiter, rouvrir, fermer, refuser ou supprimer les tickets si nécessaire.",
"L’envoi d’un ticket ne garantit ni résultat particulier, ni décision d’appel, ni délai de réponse. Le personnel peut demander des précisions ou vous orienter vers un autre canal officiel. Un usage abusif peut entraîner des restrictions d’accès ou d’autres mesures de modération."
]},
de: {
"navGuides":"Hilfeartikel","navTerms":"Nutzungsbedingungen","navPrivacy":"Datenschutz","eyebrow":"WEBSITE-RICHTLINIEN","privacy":"Datenschutzerklärung","terms":"Nutzungsbedingungen","updated":"Zuletzt aktualisiert: 19. Oktober 2026",
p:[
"Dieser Hinweis gilt für das Supportportal support.miragesmp.org, nicht für die Hauptwebsite von Mirage oder separate Minecraft- und Community-Dienste. Er beschreibt die Informationen, die zur Verwaltung von Supportkonten und Tickets verwendet werden. Der Betreiber sollte ihn an die tatsächliche Konfiguration anpassen.",
"E-Mail-Adresse, Konto-ID und Benutzername; Betreff, Kategorien, Nachrichten und Zeitstempel von Tickets; hochgeladene Anhänge sowie technische oder sicherheitsbezogene Protokolle von Dienstleistern.",
"Zur Anmeldung und Authentifizierung, zur Beantwortung von Supportanfragen, zur Aufbewahrung des Ticketverlaufs, zur Untersuchung von Fehlern oder Missbrauch und zur Sicherheit des Dienstes.",
"Ticketgespräche sind für die erstellende Person und autorisierte Supportmitarbeitende bestimmt. Gib keine Passwörter, Wiederherstellungscodes, Zahlungsdaten oder unnötigen sensiblen Informationen an.",
"Die Website verwendet statisches Hosting und Supabase für Authentifizierung, Ticketdatenbank und privaten Anhangspeicher. Resend kann je nach aktivierten Funktionen E-Mail-Adressen und Nachrichteninhalte für Anmelde-E-Mails oder Ticketbenachrichtigungen verarbeiten. Diese Anbieter unterliegen ihren eigenen Bedingungen und Datenschutzhinweisen.",
"Informationen können so lange gespeichert werden, wie es für Support, Dokumentation, Streitbeilegung oder gesetzliche Pflichten erforderlich ist. Kein Online-Dienst kann absolute Sicherheit garantieren.",
"Du kannst den Betreiber kontaktieren, um Auskunft, Berichtigung oder Löschung zu beantragen. Dabei gelten Identitätsprüfungen, technische Grenzen und anwendbares Recht.",
"Diese Richtlinie kann bei Änderungen des Dienstes aktualisiert werden. Bei Datenschutzfragen nutze die offiziellen Mirage-Supportkanäle.",
"Dies ist eine vorläufige Richtlinie und keine Rechtsberatung. Vor der Nutzung sollte der Betreiber verifizierte Verantwortlichen- und Kontaktdaten, Rechtsgrundlagen, Aufbewahrungsfristen, Angaben zu internationalen Übermittlungen und geltende Rechte ergänzen."
],
termsP:[
"Diese Bedingungen gelten speziell für die Mirage-Support-Website support.miragesmp.org einschließlich Hilfeartikeln, Anmeldung, Tickets, Antworten und Anhängen. Sie sind getrennt von den Bedingungen und Community-Regeln der Hauptwebsite und Minecraft-/Community-Dienste von Mirage, veröffentlicht unter miragesmp.org/legal.html. Mit der Nutzung des Portals stimmst du zu. Andernfalls darfst du es nicht nutzen.",
"Du musst korrekte Kontoinformationen angeben und geltende Alters- und Einwilligungsanforderungen erfüllen. Wenn du noch nicht alt genug bist, um der Verarbeitung deiner Daten rechtlich zuzustimmen, bitte vor der Kontoerstellung einen Elternteil oder Vormund um Hilfe.",
"Nutze das Portal für echte Fragen oder Meldungen zu Mirage. Spam, Belästigung, Drohungen, Identitätsbetrug, wissentlich falsche oder böswillige Meldungen, Störungen des Dienstes und unbefugte Zugriffsversuche auf fremde Konten, Tickets oder private Anhänge sind untersagt.",
"Du bist für die Sicherheit deiner Anmeldedaten und deines E-Mail-Kontos verantwortlich. Teile in Tickets keine Passwörter, Einmalcodes, Zurücksetzungslinks oder andere Kontogeheimnisse. Bei Verdacht auf unbefugten Zugriff kontaktiere den Support über einen offiziellen Kanal.",
"Beschreibe dein Anliegen klar und korrekt und übermittle nur Inhalte, die du teilen darfst. Lade keine rechtswidrigen Inhalte, Schadsoftware, Drohungen oder unnötig offengelegte private Informationen anderer hoch. Tickets und Anhänge sind für die erstellende Person und autorisierte Mitarbeitende bestimmt. Mitarbeitende können Tickets bei Bedarf kategorisieren, beantworten, wieder öffnen, schließen, ablehnen oder entfernen.",
"Ein Ticket garantiert weder ein bestimmtes Ergebnis noch eine Entscheidung über einen Einspruch oder eine Antwortfrist. Das Team kann weitere Informationen anfordern oder dich an einen offiziellen Kanal verweisen. Missbrauch kann zu Zugangsbeschränkungen oder weiteren Moderationsmaßnahmen führen."
]},
pt: {
"navGuides":"Guias","navTerms":"Termos","navPrivacy":"Privacidade","eyebrow":"POLÍTICAS DO SITE","privacy":"Política de Privacidade","terms":"Termos e Condições","updated":"Última atualização: 19 de outubro de 2026",
p:[
"Este aviso aplica-se ao portal de suporte support.miragesmp.org, não ao site principal da Mirage nem aos serviços separados de Minecraft ou da comunidade. Descreve as informações usadas para gerir contas e tickets de suporte; o operador deve mantê-lo alinhado com a configuração real.",
"Endereço de e-mail, identificador da conta e nome de utilizador; assuntos, categorias, mensagens e horários dos tickets; anexos enviados; e registos técnicos ou de segurança gerados pelos fornecedores do serviço.",
"Para autenticar contas, responder a pedidos de suporte, preservar o histórico dos tickets, investigar erros ou abusos e manter a segurança do serviço.",
"As conversas dos tickets destinam-se a ser vistas por quem criou o ticket e pela equipa de suporte autorizada. Não inclua palavras-passe, códigos de recuperação, dados de pagamento ou informações sensíveis desnecessárias.",
"O site usa alojamento estático e Supabase para autenticação, base de dados de tickets e armazenamento privado de anexos. O Resend pode processar endereços de e-mail e conteúdo de mensagens para enviar e-mails de autenticação ou notificações, conforme as funcionalidades ativadas. Estes fornecedores seguem os seus próprios termos e avisos de privacidade.",
"As informações podem ser guardadas pelo tempo necessário para prestar suporte, manter registos, resolver disputas ou cumprir obrigações legais. Nenhum serviço online pode garantir segurança absoluta.",
"Pode contactar o operador do site para pedir acesso, correção ou eliminação, sujeito a verificação de identidade, limitações técnicas e legislação aplicável.",
"Esta política pode mudar à medida que o serviço evolui. Para questões de privacidade, contacte o operador através dos canais oficiais de suporte da Mirage.",
"Esta é uma política inicial, não aconselhamento jurídico. Antes de a utilizar, o operador deve acrescentar dados verificados do responsável e de contacto, bases legais, prazos de conservação, detalhes de transferências internacionais e direitos aplicáveis."
],
termsP:[
"Estes termos aplicam-se especificamente ao site Mirage Support em support.miragesmp.org, incluindo artigos de ajuda, início de sessão, tickets, respostas e anexos. São separados dos termos e regras comunitárias do site principal da Mirage e dos serviços de Minecraft/comunidade, publicados em miragesmp.org/legal.html. Ao usar este portal, aceita estes termos. Caso não concorde, não utilize o portal.",
"Deve fornecer informações de conta corretas e cumprir os requisitos de idade ou consentimento aplicáveis. Se ainda não tiver idade para consentir legalmente ao tratamento das suas informações, peça ajuda a um encarregado de educação antes de criar uma conta.",
"Use o portal para questões ou denúncias legítimas relacionadas com a Mirage. Não envie spam, assedie, ameace, se faça passar por outra pessoa, apresente denúncias maliciosas ou deliberadamente falsas, interfira com o serviço nem tente aceder a contas, tickets ou anexos privados de terceiros.",
"É responsável por manter seguras as credenciais de acesso e a conta de e-mail. Não inclua palavras-passe, códigos únicos, ligações de reposição ou outros segredos da conta num ticket. Se suspeitar de acesso não autorizado, contacte a equipa através de um canal oficial.",
"Forneça informações claras e corretas relevantes para o pedido. Envie apenas conteúdo que tenha autorização para partilhar. Não carregue conteúdo ilegal, malware, ameaças ou informações privadas de terceiros expostas sem necessidade. Os tickets e anexos destinam-se ao autor e à equipa autorizada. A equipa pode categorizar, responder, reabrir, fechar, recusar ou remover tickets quando necessário.",
"Enviar um ticket não garante um resultado específico, decisão de recurso ou prazo de resposta. A equipa pode pedir mais informações ou encaminhá-lo para outro canal oficial. O uso abusivo pode limitar o acesso ao portal ou resultar noutras medidas de moderação."
]}
};
const lang = getPrefs().lang;
const d = L[lang]; if (d) {
 const path = location.pathname;
 const isTerms = path.endsWith("terms.html");
 const article = document.querySelector(".legal-copy");
 if (article) {
   const ps = [...article.querySelectorAll(":scope > p")];
   const arr = isTerms ? d.termsP : d.p;
   ps.forEach((p,i) => { if (arr[i]) { if (i===0 && p.querySelector("a")) { const link=p.querySelector("a"); p.textContent=arr[i]+" "; p.append(link); } else p.textContent=arr[i]; } });
   const headings = [...article.querySelectorAll("h2")];
   const privacyHeads = lang==="es"?["Información que podemos tratar","Cómo se utiliza la información","Privacidad de los tickets","Proveedores del servicio","Conservación y seguridad","Tus opciones","Cambios y contacto"]:
   lang==="fr"?["Informations susceptibles d’être traitées","Utilisation des informations","Confidentialité des tickets","Prestataires de service","Conservation et sécurité","Vos choix","Modifications et contact"]:
   lang==="de"?["Verarbeitete Informationen","Verwendung der Informationen","Vertraulichkeit der Tickets","Dienstleister","Aufbewahrung und Sicherheit","Deine Möglichkeiten","Änderungen und Kontakt"]:
   ["Informações que podemos tratar","Como as informações são usadas","Privacidade dos tickets","Prestadores de serviços","Retenção e segurança","As suas opções","Atualizações e contacto"];
   const termsHeads = lang==="es"?["1. Quién puede usar el portal","2. Uso aceptable","3. Cuentas y seguridad","4. Tickets, mensajes y archivos adjuntos","5. Decisiones del equipo y tiempos de respuesta","6. Disponibilidad del servicio y terceros"]:
   lang==="fr"?["1. Qui peut utiliser le portail","2. Utilisation acceptable","3. Comptes et sécurité","4. Tickets, messages et pièces jointes","5. Décisions de l’équipe et délais","6. Disponibilité et tiers"]:
   lang==="de"?["1. Wer darf das Portal nutzen","2. Zulässige Nutzung","3. Konten und Sicherheit","4. Tickets, Nachrichten und Anhänge","5. Entscheidungen und Antwortzeiten","6. Verfügbarkeit und Drittanbieter"]:
   ["1. Quem pode usar o portal","2. Utilização aceitável","3. Contas e segurança","4. Tickets, mensagens e anexos","5. Decisões da equipa e tempos de resposta","6. Disponibilidade e terceiros"];
   headings.forEach((h,i)=>{if((isTerms?termsHeads:privacyHeads)[i])h.textContent=(isTerms?termsHeads:privacyHeads)[i]});
 }
 const h1=document.querySelector(".page-heading h1"); if(h1) h1.textContent=isTerms?d.terms:d.privacy;
 const eyebrow=document.querySelector(".page-heading .eyebrow"); if(eyebrow) eyebrow.textContent=d.eyebrow;
 const nav=[...document.querySelectorAll(".site-nav a")]; if(nav[0])nav[0].textContent=d.navGuides; if(nav[1])nav[1].textContent=isTerms?d.navPrivacy:d.navTerms;
 const small=document.querySelector(".page-heading p:not(.eyebrow)"); if(small && !isTerms)small.textContent=d.updated;
 document.documentElement.lang=lang;
}
