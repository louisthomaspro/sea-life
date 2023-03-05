# SeaLife

## Description

PWA built with Next.js, React, Firestore and Algolia. The app allows users to explore marine life and its features include species profiles, search filters and categories.

![screenshot preview](public/screenshots/preview.jpg)

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
npx firebase emulators:start --import ./firebase/export/

# Start emulator without cloud function and UI to make it work in offline
npx firebase emulators:start --only firestore --import ./firebase/export/

# Save the current local data to be able to restore it later
npx firebase emulators:export ./firebase/export
```

## Algolia

### Synchronize Algolia data

> **Prerequisites** <br>
> Download service account key file: https://console.firebase.google.com/u/0/project/sea-life-app/settings/serviceaccounts/adminsdk <br>
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

## Facebook API

To get Facebook App info: https://developers.facebook.com/apps/518199423531488/settings/basic/
<br/>
Query : https://developers.facebook.com/tools/explorer/?method=GET&path=me%2Ffeed%3Ffields%3Dpermalink_url&version=v15.0

#### Generate permanent token

1. Get user access token: https://developers.facebook.com/tools/explorer/
2. Generate long-lived token: https://developers.facebook.com/tools/debug/accesstoken/?access_token={USER_ACCESS_TOKEN}&version=v15.0
3. Get permanent access token: https://graph.facebook.com/v15.0/{USER_ID}/accounts?access_token={LONG_LIVED_ACCESS_TOKEN}

When Data Access expires, you can regain access by following the instructions:
https://developers.facebook.com/docs/facebook-login/auth-vs-data/

## Performances

### Bundle Analyzer

```bash
yarn analyze
```

## Build and publish for Google Play Store

### 1. Build using Bubblewrap (recommended)

```bash
# Install bubblewrap
npm install -g @bubblewrap/cli

mkdir sea-life-android
cd sea-life-android
bubblewrap init --manifest=https://sea-life.vercel.app/manifest.json
bubblewrap build
```

### Other ways to build:

**Using [pwabuilder.com](https://pwabuilder.com)**

- Enter the URL of the PWA (https://sea-life.vercel.app/)
- Click on "Package For Stores" and "Android"

**Using capacitor (only static pages)**

```bash
# Build
yarn build-mobile

# If you are on WSL2, you need to copy the build folder to your windows partition and open the folder with Android Studio
sudo rm -rf /mnt/c/Users/louis/OneDrive/Documents/git/sea-life/android
sudo cp -R ./android /mnt/c/Users/louis/OneDrive/Documents/git/sea-life/android

# If you are on windows, just execute the following command
npx cap sync
npx cap open android
```

### 2. Publish on Google Play Store

- Go to https://play.google.com/console/developers
- Select sea-life
- Go to "Release" > "Production" > "Create new release"
- Upload aab file and fill the form

## Postman

### Dev (can only be used in development environment)

#### Get token (using firebase auth emulator)

```bash
curl --location --request POST 'localhost:3000/api/dev/getToken?uid=sXokqYzLlTZQ6CkDRvLruttNLDhH' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uid": "sXokqYzLlTZQ6CkDRvLruttNLDhH",
    "claims": {
        "admin": true
    }
}'
```

#### Set admin claim

```bash
curl --location --request POST 'localhost:3000/api/dev/setCustomClaims' \
--header 'Authorization: Bearer <idToken>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uid": "<uid>",
    "claims": {
        "admin": true
    }
}'
```

### Prod

#### Clear algolia index

```bash
curl --location --request POST 'localhost:3000/api/admin/clearAlgolia' \
--header 'Authorization: Bearer <idToken>'
```

<br>

# Other

## Features

- Breadcrumb
- Similar species list or species of same family
- Favorite list management
- Contribute to species (photos, text...)
- Improve search filters (shape, colors...)
- Improve text search including family names

## Other commands

```bash
npx kill-port 8080
```

## Useful links

- Figma design: https://www.figma.com/file/op3TNvwVbWuf1nN5kMUtOj/SEA-LIFE?t=M7TfKsfOFSdda5tQ-0
- https://www.pwabuilder.com/reportcard?site=https://sea-life.vercel.app/
- https://manifest-gen.netlify.app/

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
