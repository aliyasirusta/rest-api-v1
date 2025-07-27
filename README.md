# Basit Kullanıcı Yönetimi API'si

Bu proje, Node.js ve Express.js kullanarak oluşturulmuş basit bir kullanıcı yönetimi API'sidir. Kullanıcıları ekleme, listeleme, güncelleme ve silme gibi temel CRUD (Create, Read, Update, Delete) operasyonlarını destekler. Ayrıca kullanıcı filtreleme ve temel yetkilendirme (authorization) özelliklerini de içerir.

## Özellikler

- **Kullanıcı Oluşturma (Create):** Yeni kullanıcılar ekler.
- **Kullanıcı Listeleme (Read):** Tüm kullanıcıları listeler veya belirli kriterlere göre filtreler.
- **Kullanıcı Detayı (Read by ID):** Belirli bir kullanıcıyı ID'si ile getirir.
- **Kullanıcı Güncelleme (Update):** Mevcut bir kullanıcının bilgilerini günceller.
- **Kullanıcı Silme (Delete):** Belirli bir kullanıcıyı ID'si ile siler.
- **Kullanıcı Filtreleme:** `adi` (isim) ve `email` (e-posta) gibi query parametreleriyle kullanıcıları filtreler.
- **Basit Yetkilendirme:** Belirli API uç noktalarına erişimi (şu anda sadece silme işlemi) kullanıcı rollerine (örneğin `admin`) göre kısıtlar.

## Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Node.js ve npm'i Yükleyin:** Bilgisayarınızda Node.js ve npm (Node Package Manager) yüklü olduğundan emin olun. Değilse, [Node.js resmi web sitesinden](https://nodejs.org/) indirebilirsiniz.

2.  **Projeyi Klonlayın:**
    ```bash
    git clone <depo_adresiniz> # Örneğin: git clone [https://github.com/kullaniciadi/projeadi.git](https://github.com/kullaniciadi/projeadi.git)
    cd <proje_dizini> # Örneğin: cd basit-kullanici-api
    ```

3.  **Bağımlılıkları Yükleyin:**
    Proje bağımlılıklarını yüklemek için aşağıdaki komutu çalıştırın:
    ```bash
    npm install
    ```
    Bu komut `express`, `body-parser`, `uuid` gibi paketleri yükleyecektir.

4.  **Projeyi Başlatın:**
    API sunucusunu başlatmak için aşağıdaki komutu kullanın:
    ```bash
    node index.js
    ```
    Geliştirme sırasında dosya değişikliklerinde sunucuyu otomatik yeniden başlatmak için `nodemon` kullanıyorsanız:
    ```bash
    nodemon index.js
    ```
    Sunucu `http://localhost:5000` adresinde çalışmaya başlayacaktır.

## Kullanım

API uç noktalarına istek göndermek için Postman, Insomnia veya `curl` gibi araçları kullanabilirsiniz.

**API Ana Dizini:** `http://localhost:5000`

### Kullanıcı Yönetimi Uç Noktaları (`/users`)

#### 1. Kullanıcı Ekleme (POST)

-   **Endpoint:** `/users`
-   **Metot:** `POST`
-   **Body:** `application/json`
-   **Örnek İstek Gövdesi:**
    ```json
    {
        "adi": "Berkay",
        "soy_adi": "Aslan",
        "email": "berkay@example.com",
        "role": "user" 
    }
    ```
    **Not:** `role` belirtilmezse varsayılan olarak `user` atanır. `admin` rolü için `role: "admin"` olarak gönderin.

#### 2. Tüm Kullanıcıları Listeleme (GET)

-   **Endpoint:** `/users`
-   **Metot:** `GET`
-   **Örnek İstek:** `GET http://localhost:5000/users`

#### 3. Kullanıcıları Filtreleme (GET)

-   **Endpoint:** `/users?adi=<isim>&email=<e-posta>`
-   **Metot:** `GET`
-   **Parametreler:**
    -   `adi`: Kullanıcının adını filtrelemek için. (Kısmi ve küçük/büyük harf duyarsız eşleşme)
    -   `email`: Kullanıcının e-postasını filtrelemek için. (Kısmi ve küçük/büyük harf duyarsız eşleşme)
-   **Örnek İstekler:**
    -   `GET http://localhost:5000/users?adi=berkay`
    -   `GET http://localhost:5000/users?email=example.com`
    -   `GET http://localhost:5000/users?adi=berkay&email=example.com`

#### 4. ID ile Kullanıcı Detayı Getirme (GET)

-   **Endpoint:** `/users/:id`
-   **Metot:** `GET`
-   **Örnek İstek:** `GET http://localhost:5000/users/a1b2c3d4-e5f6-7890-1234-567890abcdef` (ID kısmını gerçek bir kullanıcı ID'si ile değiştirin)

#### 5. Kullanıcı Güncelleme (PATCH)

-   **Endpoint:** `/users/:id`
-   **Metot:** `PATCH`
-   **Body:** `application/json` (Sadece güncellemek istediğiniz alanları gönderin)
-   **Örnek İstek Gövdesi:**
    ```json
    {
        "email": "yeni-email@example.com"
    }
    ```
-   **Örnek İstek:** `PATCH http://localhost:5000/users/a1b2c3d4-e5f6-7890-1234-567890abcdef`

#### 6. Kullanıcı Silme (DELETE)

-   **Endpoint:** `/users/:id`
-   **Metot:** `DELETE`
-   **Yetkilendirme Gerekli:** Bu işlem sadece `admin` rolüne sahip kullanıcılar tarafından yapılabilir.
-   **Örnek İstek:** `DELETE http://localhost:5000/users/a1b2c3d4-e5f6-7890-1234-567890abcdef`

## Yetkilendirme (Authorization)

Bu projede temel bir yetkilendirme mekanizması kullanılmıştır. Özellikle `DELETE` işlemi gibi hassas işlemler için belirli roller (örneğin `admin`) gereklidir.

**Nasıl Çalışır:**

-   Yetkilendirme, isteğin `Headers` kısmında `X-User-Id` başlığı ile belirtilen kullanıcının rolünü kontrol ederek yapılır.
-   `authorizeRole('admin')` middleware'i, sadece `role` alanı `admin` olan kullanıcıların erişimine izin verir.
-   `X-User-Id` başlığı yoksa veya geçersizse `401 Unauthorized` yanıtı döner.
-   Kullanıcının rolü, gerekli rolden farklıysa `403 Forbidden` yanıtı döner.

**Postman ile Test Etme:**

1.  **Bir `admin` kullanıcısının ID'sini alın.** (Örneğin, bir `POST` isteği ile `role: "admin"` olarak bir kullanıcı oluşturun ve ID'sini kaydedin, veya `GET /users` ile mevcut admin kullanıcının ID'sini bulun.)
2.  **Bir `user` kullanıcısının ID'sini alın.** (Aynı şekilde `role: "user"` olarak bir kullanıcı oluşturun veya bulun.)
3.  **`DELETE` isteği gönderirken:**
    -   `Headers` sekmesinde `X-User-Id` başlığını ekleyin.
    -   **Admin olarak denemek için:** `X-User-Id` değerine admin kullanıcısının ID'sini girin. (Beklenen: Başarılı silme)
    -   **Normal kullanıcı olarak denemek için:** `X-User-Id` değerine user kullanıcısının ID'sini girin. (Beklenen: `403 Forbidden` yanıtı)

## Geliştirme Ortamı

-   **VS Code:** Kod editörü olarak Visual Studio Code önerilir.
-   **Nodemon:** Geliştirme sırasında dosya değişikliklerini algılayıp sunucuyu otomatik olarak yeniden başlatmak için kullanılır. (`npm install -g nodemon` ile global olarak kurulabilir.)

## Gelecek Geliştirmeler (Opsiyonel)

-   Kullanıcı verilerini kalıcı depolama (örneğin MongoDB, PostgreSQL) kullanma.
-   Tam teşekküllü kimlik doğrulama (Authentication) sistemi (örneğin JWT - JSON Web Tokens ile kullanıcı girişi/kaydı).
-   Daha gelişmiş hata yönetimi ve validasyon.
-   Testler (Unit ve Integration testleri) yazma.

---
