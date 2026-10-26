Backend: TypeScript
Frontend: VueJs
BaseDe Donnee : Postgres

cd Antily/nestjs
npm run start:dev

cd Antily/vue-crud 
npm run dev



schema.txt — Qui fait quoi ?

Navigateur ──► Controller ──► Service ──► Repository ──► Table "product"
 (demande)    (réceptionniste)  (cuisinier)  (outil BD)    (les données)
              reçoit l'URL      fait le       parle à      stockées dans
              et passe          travail       Postgres     Postgres





schema.txt — Le chemin d'une demande

[1] Navigateur : GET http://localhost:3000/member
       │
       ▼
[2] main.ts            → Nest écoute sur le port 3000
       │
       ▼
[3] member.controller.ts → @Controller('member') + @Get() → findAll()
       │                   (ne fait rien lui-même)
       ▼
[4] member.service.ts    → this.repository.find()
       │
       ▼
[5] Table "member" (Postgres)
       │
       ▼
[6] Les lignes remontent : service → controller → navigateur (au format JSON)



Côté	                            Ce qu’il a	Dans le code
Product (la valise)	                L’étiquette branch_id	            @ManyToOne + @JoinColumn
Branch (le propriétaire)	        La liste de ses valises,            sans étiquette	@OneToMany





schema.txt : le voyage complet

NAVIGATEUR (ton écran)
   │
   │ [1] tu tapes http://localhost:5173/member
   ▼
VITE (port 5173)  ── envoie les fichiers du front (HTML + JS) ──► navigateur
   │                  le code Vue tourne maintenant DANS le navigateur
   ▼
[2] router/index.ts          "/member" = page MemberList.vue
[3] MemberList.vue           onMounted → apiClient.list('member')
[4] api/client.ts            fetch → GET http://localhost:3000/member
   │
   │   (le navigateur traverse du port 5173 au port 3000)
   ▼
NEST (port 3000)
[5] main.ts                  enableCors() : "OK, tu peux m'appeler"
[6] member.controller.ts     @Get() → findAll()      (réceptionniste)
[7] member.service.ts        this.repository.find()  (cuisinier)
[8] Repository<Member>       outil lié à la table
[9] member.entity.ts         ← LE MODÈLE : la recette (voir 3)
[10] POSTGRES                table "member" : les lignes
   │
   │   la réponse REMONTE par le même chemin :
   ▼
[11] lignes → objets Member → service → controller → JSON
[12] client.ts : res.json() → MemberList.vue : rows.value = data
[13] le tableau s'affiche à l'écran


schema.txt : le fil à retenir (mnémo : E-D-S-C-M)

E ntity      → la table en code             (étape 1)
D TO         → ce que le front a le droit d'envoyer  (étape 2)
S ervice     → le travail avec la base      (étape 3)
C ontroller  → les routes                   (étape 4)
M odule      → on assemble + on inscrit dans app.module.ts  (étape 6)



schema.txt : liste + formulaire dans le voyage complet

[1] /branch                  → router → BranchList.vue
[2] onMounted(load)          → apiClient.list('branch')  → GET /branch
[3] réponse JSON             → rows.value = data         → v-for → tableau à l'écran

[4] clic "Modifier"          → RouterLink to="/branch/42/edit"
[5] router                   → BranchForm.vue  (id = "42")
[6] onMounted                → apiClient.get('branch', '42')  → GET /branch/42
                             → values.name = ...  → v-model remplit le champ

[7] clic "Enregistrer"       → handleSubmit
       ├─ id existe ? → apiClient.update  → PATCH /branch/42
       └─ sinon       → apiClient.create  → POST  /branch   (→ DTO du back, étape 2)
[8] router.push('/branch')   → retour à la liste (retour en [1])

[9] clic "Supprimer"         → handleDelete → apiClient.remove → DELETE /branch/42
                             → load() : on recharge la liste




AUTHENTIFICATION
schema.txt : les fichiers de l'étape 2, dans l'ordre d'écriture

nestjs/src/
├── auth/                              ← [1] CRÉE le dossier
│   ├── dto/register.dto.ts            ← [2] email + mot de passe reçus (le videur)
│   ├── auth.service.ts                ← [3] le travail : vérifier, brouiller, enregistrer
│   ├── auth.controller.ts             ← [4] la route POST /auth/register
│   └── auth.module.ts                 ← [5] assemble le tout (forFeature([User]))
├── user/entities/user.entity.ts       ← déjà fait ✔ (le service l'importe)
├── app.module.ts                      ← [6] AJOUTE AuthModule dans imports: [...]
└── main.ts                            ← [7] ACTIVE ValidationPipe

Le chemin d'une inscription :
POST /auth/register ─► [4] controller ─► [3] service
                                            ├─ email déjà pris ? → erreur 409
                                            ├─ brouille le mot de passe
                                            └─ enregistre { email, passwordHash }
                                         ─► renvoie { id, email }   (jamais le hash)