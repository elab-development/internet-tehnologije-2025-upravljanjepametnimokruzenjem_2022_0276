FROM php:8.2-fpm

# Instalacija sistemskih zavisnosti
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

# Instalacija PHP ekstenzija
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalacija Composer-a
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Kopiranje koda
COPY . .

# Instalacija zavisnosti
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Dozvole za storage i cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]