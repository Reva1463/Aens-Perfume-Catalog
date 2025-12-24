Aens-Perfume-Catalog

Ini adalah website landing page dan katalog produk yang responsif untuk AENS PERFUME. Proyek ini dibangun dengan HTML, CSS, dan JavaScript untuk menampilkan koleksi produk secara elegan dan interaktif.

✨ Fitur Utama
Desain Responsif: Tampilan dioptimalkan untuk berbagai ukuran layar, mulai dari desktop hingga perangkat mobile.
Katalog Produk Interaktif: Kartu produk yang menampilkan detail lebih lanjut saat diklik.
Modal Detail Produk: Pop-up (modal) yang menampilkan informasi lengkap tentang setiap parfum, termasuk deskripsi dan fragrance notes.
Navigasi Mobile-First: Menu hamburger yang intuitif untuk navigasi di layar kecil, lengkap dengan fungsi "klik di luar untuk menutup".
Efek Visual Modern: Efek hover yang halus pada produk dan header transparan yang berubah warna saat scroll.
Penguncian Scroll: Latar belakang halaman terkunci saat menu navigasi atau modal produk terbuka untuk pengalaman pengguna yang lebih baik.

📂 Struktur File
```aens-perfume/
Aens Perfume Catalog
├─ aens-perfume-backend/
│  ├─ node_modules
│     ├─ .bin
│     ├─ @mongodb-js
│     ├─ @types
│     ├─ accepts
│     ├─ anymatch
│     ├─ append-field
│     ├─ array-flatten
│     ├─ balanced-match
│     ├─ bcryptjs
│     ├─ binary-extensions
│     ├─ body-parser
│     ├─ brace-expansion
│     ├─ braces
│     ├─ bson
│     ├─ buffer-equal-constant-time
│     ├─ buffer-from
│     ├─ busboy
│     ├─ bytes
│     ├─ call-bind-apply-helpers
│     ├─ call-bound
│     ├─ chokidar
│     ├─ concat-map
│     ├─ concat-stream
│     ├─ content-disposition
│     ├─ content-type
│     ├─ cookie
│     ├─ cookie-signature
│     ├─ core-util-is
│     ├─ cors
│     ├─ debug
│     ├─ depd
│     ├─ destroy
│     ├─ dotenv
│     ├─ dunder-proto
│     ├─ ecdsa-sig-formatter
│     ├─ ee-first
│     ├─ encodeurl
│     ├─ escape-html
│     ├─ es-define-property
│     ├─ es-errors
│     ├─ es-object-atoms
│     ├─ etag
│     ├─ express
│     ├─ fill-range
│     ├─ finalhandler
│     ├─ forwarded
│     ├─ fresh
│     ├─ function-bind
│     ├─ get-intrinsic
│     ├─ get-proto
│     ├─ glob-parent
│     ├─ gopd
│     ├─ has-flag
│     ├─ hasown
│     ├─ has-symbols
│     ├─ http-errors
│     ├─ icony-lite
│     ├─ ignore-by-default
│     ├─ inherits
│     ├─ ipaddr.js
│     ├─ isarray
│     ├─ is-binary-path
│     ├─ is-extglob
│     ├─ is-glob
│     ├─ is-number
│     ├─ jsonwebtoken
│     ├─ jwa
│     ├─ jws
│     ├─ kareem
│     ├─ lodash.includes
│     ├─ lodash.isboolean
│     ├─ lodash.isinteger
│     ├─ lodash.isnumber
│     ├─ lodash.isplainobject
│     ├─ lodash.isstring
│     ├─ lodash.once
│     ├─ math-instrinsics
│     ├─ media-typer
│     ├─ memory-pager
│     ├─ merge-descriptors
│     ├─ methods
│     ├─ mime
│     ├─ mime-db
│     ├─ mime-types
│     ├─ minimatch
│     ├─ minimist
│     ├─ mkdirp
│     ├─ mongodb
│     ├─ mongodb-connection-string-url
│     ├─ mongoose
│     ├─ mpath
│     ├─ mquery
│     ├─ ms
│     ├─ multer
│     ├─ negotiator
│     ├─ nodemon
│     ├─ normalize-path
│     ├─ object-assign
│     ├─ object-inspect
│     ├─ on-finished
│     ├─ parseurl
│     ├─ path-to-regexp
│     ├─ picomatch
│     ├─ process-nextick-args
│     ├─ proxy-addr
│     ├─ pstree.remy
│     ├─ punycode
│     ├─ qs
│     ├─ range-parser
│     ├─ raw-body
│     ├─ readable-stream
│     ├─ readdirp
│     ├─ safe-buffer
│     ├─ safer-buffer
│     ├─ semver
│     ├─ send
│     ├─ serve-static
│     ├─ setprototypeof
│     ├─ side-channel
│     ├─ side-channel-list
│     ├─ side-channel-map
│     ├─ side-channel-weakmap
│     ├─ sift
│     ├─ simple-update-notifier
│     ├─ sparse-bitfield
│     ├─ statuses
│     ├─ streamsearch
│     ├─ string_decoder
│     ├─ supports-color
│     ├─ toidentifier
│     ├─ to-regex-range
│     ├─ touch
│     ├─ tr46
│     ├─ typedarray
│     ├─ type-is
│     ├─ undersafe
│     ├─ unpipe
│     ├─ util-deprecate
│     ├─ util-merge
│     ├─ vary
│     ├─ webidl-converions
│     ├─ whatwg-url
│     ├─ xtend
│     ├─ .package-lock.json
│  ├─ .env
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ seed.js
│  ├─ server.js
│  ├─ style.css
│  ├─ script.js
│
├─ FRONTEND
│  ├─ AENS LOGO.jpeg
│  ├─ AENS_LOGO-removebg-preview.png
│  ├─ api.js
│  ├─ BERRY.jpg
│  ├─ BLUE NIGHT.jpg
│  ├─ COOLMAN.jpg
│  ├─ Index.html
│  ├─ LUCKY.jpg
│  ├─ package-lock.json
│  ├─ PINKFON.jpg
│  ├─ ROMANCE.jpg
│  ├─ script.js
│  ├─ style.css
│
├─ uploads
├─ package-lock.json
├─ README.md
