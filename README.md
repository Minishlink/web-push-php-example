# Web Push example in PHP

Navigating through the commits and files will help you build:
- on the client
    - a user friendly opt-in push notification button
- on the server
    - an endpoint for managing your push notification subscriptions
    - an endpoint that triggers push notification thanks to [web-push-php](https://github.com/web-push-libs/web-push-php)

## Requirements
- Chrome or Firefox
- [composer](https://getcomposer.org/)
- PHP 8.0+
    - gmp
    - mbstring
    - curl
    - openssl

PHP 7.2 is no longer maintained, but you can checkout the `v3.x` tags.
PHP 7.1 is no longer maintained, but you can checkout the `v2.x` tags.
PHP 5.6+ is no longer maintained, but you can checkout the `v1.x` tags.

## Installation
```bash
$ composer create-project minishlink/web-push-php-example
$ cd web-push-php-example
```

You can change the VAPID keys in the [keys](./keys) folder with [this guide](https://github.com/web-push-libs/web-push-php#authentication-vapid).
Don't forget to update the public key in [app.js](./src/app.js) too.

## Usage

```bash
$ php -S localhost:8000 router.php
```

And open [localhost:8000](http://localhost:8000).
