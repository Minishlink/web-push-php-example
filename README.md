# Web Push example in PHP

Navigating through the commits and files will help you build:
- on the client
    - a user friendly opt-in push notification button
- on the server
    - an endpoint for managing your push notification subscriptions
    - an endpoint that triggers push notification

## Requirements
- Chrome or Firefox
- PHP 5.6+
    - gmp
    - mbstring
    - curl
    - openssl

## Installation
```bash
$ composer install minishlink/web-push-php-example
```

## Usage

```bash
$ php -S localhost:8000 router.php
```

And open [http://localhost:8000](localhost:8000).
