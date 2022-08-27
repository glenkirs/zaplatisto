#!/bin/bash
# Единственный вариант запуска приложения предварительным
# Запуском миграций, позволяющий приложению получать
# Сигналы завершения работы от k8
# `npm start` не прокидывает 'SIGTERM', 'SIGINT' приложению

# Запускаем миграцию
npm run migrate

# Запускаем само приложение
exec node src/index.js