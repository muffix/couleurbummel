# Contributing guidelines

Thank you for considering to contribute to the app. 🙌 This document describes the process and how to set up your
development environment.

## Before you start

To avoid duplication of or unnecessary work, please make sure that your idea or feature is in line with the aims of this
project. The primary goal of this app is to facilitate the tradition of _Couleurbummel_.

Please have a quick look at the existing [issues]. If your idea isn't listed there, create an issue first and describe
it; particularly if it's a larger one. This helps us to ensure that we can merge your contribution once it's done.

## Requirements

The following are the general requirements for contributions. They aren't enforced dogmatically, but serve as a
guideline.

### Inclusivity

New features should be inclusive of as many corporations as possible. There may be exceptions to that rule which we can
discuss on the issue page.

### Language

Contributions must support at German and English languages.

## Development environment

Couleurbummel is written in [React Native] with TypeScript. Please follow
the [instructions on their website](https://reactnative.dev/docs/environment-setup) first.

## Dependencies

Node 16 - See `.node-version` for the specific version.

The project uses `yarn` 3 as a package manager and makes use of
its [zero-installs](https://yarnpkg.com/features/zero-installs) strategy, which means that all
dependencies (`.yarn/cache`) are committed to the repository.

Run `corepack enable` to enable `yarn` and install the dependencies.

```shell
yarn install
```

To run the iOS version, you additionally need to install the Cocoapods dependencies.

```shell
cd ios
pod install
```

Depending on the app you're looking to build, you'll additionally need the following:

### Android

- Java 11 to compile the Android app. Tested with `zulu-11.60.19`, but any Java 11 should work

### iOS

- Ruby 2.7.5 in order to run Cocoapods for iOS - See `.ruby-version` for the specific version
- Xcode 14 and the SDKs that come with it

## Running

In a shell, start Metro from the root of the repository:

```shell
yarn start
```

In a second shell, you can run the app in either the simulator or on a real device connected via USB:

```shell
yarn ios
yarn android # Remember to add a Google Maps API key (see below)
```

If you're running the app on a real device, it might need to be prepared. Please follow the instructions on
the [React Native website](https://reactnative.dev/docs/running-on-device).

The repository doesn't come with database credentials, but uses a JSON dump with some test entries, so you'll only see a
handful of pins on the map. The final app will of course pull all data from the database.

## Environment variables

Some settings can be made in the `.env` file in the root of the repository. You can leave all of them unchanged for
testing, unless you're planning on running the app on Android. In that case you'll need to fill in an API key for Google
Maps. You can obtain a key [here](https://developers.google.com/maps/documentation/android-sdk/get-api-key). Please make
sure not to commit the key. A good way to do that is to make Git think you didn't change the file:

```shell
git update-index --skip-worktree .env
```

[issues]: https://github.com/muffix/couleurbummel/issues

[React Native]: https://reactnative.dev/
