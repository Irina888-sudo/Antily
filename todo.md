Parcours complet : 8 étapes
#	Étape	Fichier(s)	Preuve à me montrer	État
1	Réparer register	auth.module.ts	Le serveur démarre	✅
2	Tester register	terminal + Postgres	201 puis 409, ligne en base	✅
3	login (API)	login.dto.ts, auth.service.ts, auth.controller.ts	200 avec le bon mot de passe, 401 avec le faux	🟡 On y est
4	JWT : le badge	auth.module.ts, auth.service.ts, .env	Un access_token reçu	⬜
5	Guard : protéger les routes	nouveau guard + controllers	401 sans badge, 200 avec	⬜
6	Export CSV des membres (API)	member.controller.ts, member.service.ts	Un fichier .csv téléchargé avec curl + badge	⬜
7	Front : Register.vue et Login.vue branchés	client.ts, Login.vue, Register.vue	Connexion réussie dans le navigateur	⬜
8	Front : pages protégées + bouton « Exporter CSV »	router/index.ts, MemberList.vue	/member renvoie vers /login sans token, et le CSV se télécharge	⬜


// TODO: Ajouter la vérification du mot de passe

// FIXME: Corriger le calcul du total

// BUG: Le bouton ne fonctionne pas
