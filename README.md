# Vie Marine

## Getting Started

> **Prerequisites** <br>
> Node.js

```bash
# Copy env file and update it
cp .env.local.example .env.local

npm install --global yarn
yarn install
yarn dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

---
<br>

## Firebase

Firebase is used for authentication and database and functions.
We can use the emulator to test locally.

### Installation
```bash
npm install -g firebase-tools
npx firebase login
npx firebase use sea-life-app # (optional)

# Select Authentication, Functions, Firestore
npx firebase init emulators
# Get current extension configuration
npx firebase ext:export # (optional)
```

### Functions

```bash
# Compile functions automatically to test in local
npm run build:watch --prefix functions # (open a separate terminal window)

# Deploy to cloud
npx firebase deploy --only functions # all functions
npx firebase deploy --only functions:group-updateCountOnGroupCreate # single function
```

### Database

```bash
# Update env variable
# NEXT_PUBLIC_FIREBASE_EMULATOR=true

# Start emulator with existing local data
npx firebase emulators:start --import ./firebase_export/

# Save the current local data to be able to restore it later
npx firebase emulators:export ./firebase_export
```

## Algolia

### Synchronize Algolia data

> **Prerequisites** <br>
> Download service account key file: https://console.firebase.google.com/u/0/project/sea-guide/settings/serviceaccounts/adminsdk <br>
> Upload the file to the root of the project and rename it to `sea-life-app-firebase-adminsdk.json`

```bash
npm install -g firestore-algolia-search
npx firestore-algolia-search

What is the Region? europe-west1
What is the Project Id? sea-life
What is the Algolia App Id? TIXD5TTYDU
What is the Algolia Api Key? { ALGOLIA_SEARCH_ADMIN_KEY }
What is the Algolia Index Name? species
What is the Collection Path? species
What are the Fields to extract? id,scientific_name,common_names,photos
What is the Transform Function? { empty }
What is the path to the Google Application Credential File? ./sea-life-app-firebase-adminsdk.json
```

Change extracted field in **firestore extension** :
https://console.firebase.google.com/project/sea-life-app/extensions/instances/firestore-algolia-search?tab=config

## Performances

### Bundle Analyzer

```bash
yarn analyze
```

## Features

- Breadcrumb for ancestors
- Similar species list
- Favorite list management
- Update life information (photos, text...)
- Display conservation status
- Improve search filters (shape, colors...)
- Improve text search including family names

## Improvement

- Static page only for species info
- Etoile de mer rouge doesnt appear in group:faune and type:species ?
- Rules for storage and firestore (prevent auth null)

## Other commands

```bash
npx kill-port 8080
```

## Archive code

#### Get blob from external url and upload to storage

```ts

// Back
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.body;
  const blob = await fetch(url).then((r) => r.blob());

  res.setHeader("Content-Type", blob.type);
  const buffer = await blob.arrayBuffer();
  res.send(Buffer.from(buffer) as any);
}

// Client
const blob = await fetch("http://localhost:3000/api/getINaturalistImage", {
  method: "POST",
  mode: "cors",
  cache: "default",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
}).then((res) => res.blob());

...

const storageRef = ref(storage, `${filePath}.${extension}`);
await uploadBytes(storageRef, blob);
```
