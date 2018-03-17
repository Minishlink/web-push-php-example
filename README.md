# Web Push example in PHP

Navigating through the commits and files will help you build:
- on the client
    - a user friendly opt-in push notification button
- on the server
    - an endpoint for managing your push notification subscriptions
    - an endpoint that triggers push notification thanks to [web-push-php](https://github.com/web-push-libs/web-push-php)

## Requirements
- Chrome or Firefox
- PHP 7.1+
    - gmp
    - mbstring
    - curl
    - openssl

PHP 5.6+ is no longer maintained, but you can checkout the `v1.x` branch.

## Installation
```bash
$ composer create-project minishlink/web-push-php-example
$ cd web-push-php-example
```

## Usage

```bash
$ php -S localhost:8000 router.php
```

And open [localhost:8000](http://localhost:8000).
