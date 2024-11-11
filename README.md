# Untitled Blood Center Companion App
Open source blood donation app built for large-scale blood banks to facilitate donor logging, donor certificates, emergency blood donation and the works.

![outline](https://i.imgur.com/DPutcQh.png)

## Why?
A hospital/medical institute near me has a massive blood bank. When someone wants to donate blood, they fill out a form and an employee manually enters it into a massive Excel sheet. When they need blood urgently, they have one person painstakingly go through the sheet, filter out donors who haven’t donated in over three months, check if they meet certain other criteria, and individually call them on the phone and ask if they can donate.

The manager of the blood bank is a friend of my parents and I reached out to him and asked if I could maybe build something to help solve this as a summer project, and he, being the awesome person he is, agreed and even offered to take me around the blood bank! I honestly did not expect to see so much tech, but apparently technology is omnipresent in the entire process.

Having understood the process of how people actually donate blood here, I set out to build them an app that would have a different view for both the donors and the actual blood bank employees. Each donor would have a uuid that the blood bank would use as a donor’s identity. Instead of having the blood bank fill out the form for the donors, the donors themselves would be able to go through a comprehensive sign up form on the app, which the blood bank would have to verify before drawing blood. When donors actually donate, they’d open a page on the app with a QR code that contains their uuid and can be scanned by the employee’s side of the app to either verify their records or log their donation. Everything is stored on a serverless Postgres DB so that it’s as fast as possible.

When there’s an urgent need for blood, the blood bank can send a request through the app, which batches notifications and sends them as critical alerts on iOS or bypasses the DnD on Android, and if opted-in, sends them an SMS message. The batches will be send in the order of proximity to the blood bank. I thought about how annoying this would be to the donors, but they would only receive this once every 3-4 months if they haven’t donated yet.

We’re also working to get donations as digitally signed certificates on [DigiLocker](https://www.digilocker.gov.in), and if it works at JIPMER I’ll try expanding to other blood banks.

I wrote the app using React Native w/ Expo and Next.js route handlers for the backend. I'll migrate to NestJS once everything is stable. TypeScript is yummy 😋😋😋

# Running The App

# iOS
cd into the project, and then follow the [Expo guide](https://docs.expo.dev/get-started/set-up-your-environment/). Copy the contents of `app.example.json` into a new file, `app.json`. Make sure you click **Development build** and toggle **Build with Expo Application Services** if you haven’t done this before. After that, run the project with the command ```npx expo start```

# Android
Setup for Android is similar to iOS, but requires more setup for Notifications and Google Maps
First, follow the instructions for iOS setup, but before running `npx expo start`, follow these instructions:
- [Google Maps setup](https://docs.expo.dev/versions/latest/sdk/map-view/#android). Make sure you click **For development builds**.
- [Notifications](https://docs.expo.dev/push-notifications/fcm-credentials/)


Finally, set up the backend by following these [instructions](https://github.com/mikidoodle/bloodbankapi)




