## 3.5.1 (2026-04-17)

This was a version bump only, there were no code changes.

## 3.5.0 (2026-04-16)

### 🚀 Features

-   add internationalized-date-adapter (DS-4663)

### 🩹 Fixes

-   **date-formatter:** pass time options to `rangeLongDateTime` for opened ranges (DS-4852)

### ❤️ Thank You

-   Kamil Emeleev

## 3.4.0 (2025-10-21)

### 🚀 Features

-   added method for calendar units calculation (#DS-4226)

### ❤️ Thank You

-   Nikita Guryev

## 3.3.0 (2025-09-25)

### 🚀 Features

-   **adapter:** added startOf (#DS-4216)

### ❤️ Thank You

-   Nikita Guryev

## 3.2.3 (2025-03-13)

### 🩹 Fixes

-   added LAST_PART_SEPARATOR in duration method (#DS-3471)

### ❤️ Thank You

-   Leonid Kramarov

## 3.2.2 (2025-03-13)

### 🩹 Fixes

-   separator for duration (#DS-3471)

### ❤️ Thank You

-   lskramarov

## 3.2.1 (2025-03-06)

### 🚀 Features

-   added locale tk-TM (Türkmen) (#DS-3302)

### 🩹 Fixes

-   month names for tk-TM (#DS-3458)

### ❤️ Thank You

-   Leonid Kramarov

## 3.2.0 (2025-02-04)

### 🚀 Features

-   added locale tk-TM (Türkmen) (#DS-3302)

### 🩹 Fixes

-   **adapter:** setLocale does not work without reinitializing the object (#DS-2903)
-   **luxon,adapter:** custom timezone date formatting (#DS-3128)

### ❤️ Thank You

-   Leonid Kramarov
-   Nikita Guryev

## 3.1.4 (2024-11-22)

### 🩹 Fixes

-   **adapter:** setLocale does not work without reinitializing the object (#DS-2903)
-   **luxon,adapter:** custom timezone date formatting (#DS-3128)

### ❤️ Thank You

-   Leonid Kramarov
-   Nikita Guryev

## 3.1.3 (2024-10-17)

### 🩹 Fixes

-   **adapter:** setLocale does not work without reinitializing the object (#DS-2903)

### ❤️ Thank You

-   Leonid Kramarov

## 3.1.2 (2024-06-27)

This was a version bump only, there were no code changes.

## 3.1.1 (2024-06-27)

### 🩹 Fixes

-   **adapter:** Неправильное отображение "июня", "июля" в Date short format (#DS-2596)

### ❤️ Thank You

-   Nikita Guryev

## 3.1.0 (2024-05-30)

### 🩹 Fixes

-   **build:** packages format #DS-2462
-   **chore:** add package info in notifier (#DS-2351)

### ❤️ Thank You

-   Nikita Guryev
-   Oleg Pimenov

## 3.0.2 (2024-03-28)

This was a version bump only, there were no code changes.

## 3.0.1 (2024-03-28)

### 🚀 Features

-   обновление NX и minor зависимостей
-   @mosaic-design -> @koobiq
-   **adapter:** Новый формат даты и времени для английского (#DS-1922)
-   **adapter, formatter:** Добавить локали: pt-BR, es-LA, zh-CN и fa-IR (#DS-1656, #DS-1648)
-   **build:** build hybrid esm/cjs packages (#DS-1292)
-   **build:** update packages list and lock file
-   **formatter:** basic date formatters and adapters moved to separated package (#DS-1191)
-   **formatter:** Форматтер для длительности (#DS-1180)

### 🩹 Fixes

-   versions
-   added caret for deps
-   **adapter:** [Moment] Отображение длительностей (duration) не реализовано (#DS-1441)
-   **adapter:** Invalid Date в pipes (#DS-1336)
-   **adapter:** incorrect date representation in datepicker for moment adapter (#DS-2138)
-   **adapter:** luxon, moment realization adapters sync (#DS-2147)
-   **formatter:** Invalid milliseconds string (#DS-2100)

### ❤️ Thank You

-   Ildar Dzhakparov
-   Leonid Kramarov
-   Nikita Guryev
-   Oleg Pimenov

# 3.0.0 (2024-03-27)

### Date Formatter & Adapter

-   feature libs version sync 4531b6e3

# 1.0.3 "Successful Hephaestus" (2024-02-12)

### Date Formatter & Adapter

-   feature @mosaic-design -> @koobiq ccbb73d

## 2.1.5 (2024-02-08)

### Date Formatter & Adapter

-   bug fix **adapter:** incorrect date representation in datepicker for moment adapter (#DS-2138) 06de7bf
-   bug fix **adapter:** luxon, moment realization adapters sync (#DS-2147) 13ce99f

## 2.1.4 (2024-01-23)

### Date Formatter & Adapter

-   bug fix **formatter:** Invalid milliseconds string (#DS-2100) bd340a7

## 2.1.3 (2023-12-18)

### Libraries

-   bug fix **adapter:** Invalid Date в pipes (#DS-1336) 305390a

## 2.1.2 "Verbose Seaboard" (2023-12-07)

### Libraries

-   bug fix added caret for deps fde4337

## 2.1.1 (2023-11-17)

### Libraries

-   bug fix versions 588dca8

# 2.1.0 "Morning Bonus" (2023-10-27)

### Libraries

-   feature **adapter:** Новый формат даты и времени для английского (#DS-1922) aff11d1

# 2.0.0 (2023-10-10)

### Libraries

-   feature **adapter, formatter:** Добавить локали: pt-BR, es-LA, zh-CN и fa-IR (#DS-1656, #DS-1648) ba76175

# 1.2.0 (2023-07-17)

### Libraries

-   bug fix **adapter:** [Moment] Отображение длительностей (duration) не реализовано (#DS-1441) b400844
-   feature обновление NX и minor зависимостей ae878b8

# 1.1.0 (2023-03-03)

### Libraries

-   feature **formatter:** Форматтер для длительности (#DS-1180) eb7204f

## 1.0.2 "Lobster Interstice" (2023-02-01)

### Libraries

-   feature **build:** update packages list and lock file 51ef5ff

## 1.0.1 "Losing Extravaganza" (2023-01-26)

### Libraries

-   feature **build:** build hybrid esm/cjs packages (#DS-1292) 044df4c

# 1.0.0 "Manufacturing Ponza" (2023-01-20)

### Libraries

-   feature **formatter:** basic date formatters and adapters moved to separated package (#DS-1191) 4f57bfa
