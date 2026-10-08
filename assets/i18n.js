(() => {
  const STORAGE_KEY = '94ezy-language';
  const DEFAULT_LANGUAGE = 'en';
  const languages = {
    en: { label: 'English', html: 'en' },
    'zh-CN': { label: '简体中文', html: 'zh-Hans' },
    'zh-TW': { label: '繁體中文', html: 'zh-Hant' },
    ms: { label: 'Bahasa Melayu', html: 'ms' }
  };

  const zhCN = {
    'Main Page':'首页','Gear':'设备','Tutorial':'教程','Gallery':'作品展示','Branches':'服务点','How It Works':'租赁流程','How it works':'租赁流程','FAQ':'常见问题','Contact':'联系我们',
    'Browse Gear':'浏览设备','Explore':'查看详情','Reviews':'客户评价','Social':'社交平台','Gear list':'设备列表','Customer gallery':'客户作品','Email us':'电邮联系','Enquiry form':'咨询表格','Compliance':'政策与条款','Privacy policy':'隐私政策','Shipping policy':'配送政策','T&C':'条款与条件',
    'Camera, drone and vlog gear rental across Malaysia and Singapore. Shoot more, spend less.':'覆盖马来西亚与新加坡的相机、无人机及 Vlog 设备租赁。用更少预算，拍出更多精彩。',
    'Malaysia & Singapore creator gear rental':'马来西亚与新加坡创作者设备租赁','Rent The':'租下','Shot.':'镜头。','Own The':'掌握','Moment.':'此刻。',
    'Professional cameras, drones and creator kits—carefully checked, ready to shoot, and supported by a real local team.':'专业相机、无人机和创作套装，每套均经过检查、随取随拍，并由本地团队提供支持。',
    'pickup regions':'取件地区','Real':'真实','customer reviews':'客户评价','Fast':'快速','WhatsApp support':'WhatsApp 支持','Rent with confidence':'安心租赁','Creator gear, professionally prepared.':'专业准备的创作者设备。',
    'Checked before handover':'交付前全面检查','Clean, tested and shoot-ready':'清洁、测试完毕、随取随拍','Flexible collection':'灵活取件','Pickup, delivery and Lalamove':'自取、配送及 Lalamove','Trusted by real renters':'真实租客信赖','Google and Facebook reviews':'Google 与 Facebook 真实评价',
    'Featured Collection':'精选系列','Explore Signature Gear':'探索精选设备','A curated selection of flagship creator gear, presented in a cleaner showroom-style layout so clients can compare standout models quickly before moving into enquiry.':'精选旗舰创作设备，以清晰的展示方式呈现，方便您快速比较热门型号并提出咨询。',
    'Creator Showcase':'创作者精选','Swipe Through Signature Setups':'滑动浏览精选套装','A more cinematic browse inspired by Porsche-style product storytelling. Swipe through short product loops, compare categories instantly, and jump straight into the gear that fits your shoot.':'以更具电影感的方式浏览产品。滑动观看短片、快速比较类别，并直接选择适合拍摄的设备。',
    'Self-Pickup Near You':'就近自取','A more visual branch guide that makes self-pickup points clear at a glance, with animated markers that jump into focus when clients arrive at this section.':'直观的服务点地图，让您快速查看可自取地点。','Self-Pickup Available':'支持自取',
    'Malaysia-wide delivery and Lalamove support are available too. Message us on WhatsApp to confirm branch coverage, gear availability, and the most suitable pickup point for your shoot.':'我们也提供全马配送及 Lalamove 服务。请通过 WhatsApp 确认覆盖范围、设备库存及最适合您的取件点。',
    'Campaign Story':'品牌故事','KOL Collabs, Ads & FM Features':'KOL 合作、广告与电台专访','Guides From Our Feed':'社交平台实用指南','A curated RedNote guide wall for beginners, travellers, and content creators who want quick tips before renting the right gear.':'为新手、旅行者和内容创作者精选的小红书指南，帮助您在租赁前快速掌握实用技巧。',
    'Follow On Xiaohongshu':'关注小红书','Google Reviews':'Google 评价','What renters say':'租客怎么说','Real reviews from our Google profile.':'来自 Google 商家页面的真实评价。','Read All Reviews On Google':'查看全部 Google 评价',
    'Booking Enquiry':'租赁咨询','Book Your Gear':'预订设备',"Fill in your rental details and we'll open WhatsApp with a pre-filled message, so you can confirm availability fast.":'填写租赁资料后，我们会打开已预填信息的 WhatsApp，方便您快速确认库存。',
    'Rental Enquiry - Confirmation via WhatsApp':'租赁咨询－通过 WhatsApp 确认','Your Name':'您的姓名','Equipment':'设备','Select equipment':'选择设备','I need a recommendation - help me choose!':'我需要推荐－请帮我选择！','Other gear request':'其他设备需求',
    'Start Date':'开始日期','End Date':'结束日期','Location / Area':'地点／地区','Select state':'选择州属','Outside Malaysia (SG / TW)':'马来西亚以外（新加坡／台湾）','Other / Custom area':'其他／自定义地区','What are you shooting?':'您要拍摄什么？',
    'Wedding / Event':'婚礼／活动','Travel / Vlog':'旅行／Vlog','Commercial / Ad':'商业／广告','Sports / Action':'运动／动作','Real Estate':'房地产','Other':'其他','Proceed to WhatsApp':'前往 WhatsApp',
    'Facebook Reviews':'Facebook 评价','What Facebook customers say':'Facebook 客户怎么说','Real screenshot highlights from our Facebook page.':'来自 Facebook 页面的真实评价截图。','Visit Our Facebook Page':'浏览 Facebook 页面',
    'Gear Collection':'设备系列','Our':'我们的','Catalogue':'设备目录','All Equipment':'全部设备','All':'全部','Drones':'无人机','Drone':'无人机','Action Cameras':'运动相机','Action Camera':'运动相机','360 Camera':'360 相机','Digital Cameras':'数码相机','Digital Camera':'数码相机','Accessories':'配件','Accessory':'配件','Watch Tutorials':'观看教程','Browse the full collection and select any item to view details, included kit, and booking options.':'浏览完整设备系列，选择产品即可查看详情、套装内容及预订方式。','Explore every camera, drone and creator accessory currently listed by 94 EZY RENT. Select a device to see its details and book directly through WhatsApp.':'浏览 94 EZY RENT 现有的相机、无人机及创作者配件。选择设备即可查看详情，并通过 WhatsApp 直接预订。','devices available':'台设备可供租用','View Details →':'查看详情 →','← Back to all gear':'← 返回全部设备','Highlights':'产品亮点','Standard kit':'标准套装','Book on WhatsApp':'通过 WhatsApp 预订','Open enquiry form':'打开咨询表格','Contact for rate':'联系我们获取报价','Availability and final rental pricing are confirmed personally by our team before booking.':'库存和最终租金将在预订前由我们的团队亲自确认。','Gear not found':'未找到设备','Please return to the catalogue and choose an available item.':'请返回设备目录并选择可用产品。',
    'Frequently Asked Questions':'常见问题','Quick answers for clients who need to understand the rental process, collection details, and how to choose the right setup.':'快速了解租赁流程、取件详情及如何选择合适设备。',
    'How do I book a rental?':'如何预订租赁？','Can you recommend gear for my shoot?':'可以为我的拍摄推荐设备吗？','Do you provide beginner guidance?':'是否提供新手指导？','Which areas do you cover?':'服务覆盖哪些地区？','What if I am not sure how long I need the gear?':'如果不确定租期怎么办？','Where can I contact your team?':'如何联系你们？',
    'Browse the gear, submit the booking enquiry form, or contact us on WhatsApp. We confirm the dates, advise the best setup if needed, and arrange collection.':'浏览设备并提交咨询表格，或直接通过 WhatsApp 联系我们。我们会确认日期、推荐合适套装并安排取件。',
    'Yes. Tell us what you are filming, where the shoot is happening, and what type of result you want. We can suggest the right camera, drone, or accessory combination.':'可以。告诉我们拍摄内容、地点和期望效果，我们会推荐合适的相机、无人机或配件组合。',
    'Yes. We can explain basic setup, key functions, and handling tips so first-time renters feel more confident before the shoot starts.':'可以。我们会讲解基本设置、主要功能和操作技巧，让首次租赁的客户也能安心拍摄。',
    'Use the contact section at the bottom of the main page or message us on WhatsApp for the fastest response.':'您可使用首页底部的联系区域，或通过 WhatsApp 获取最快回复。',
    'Simple Rental Flow':'简单租赁流程','A polished rental journey designed to keep every step clear, fast, and professional from gear selection to return.':'从选择设备到归还，每一步都清晰、快速且专业。','Browse The Gear':'浏览设备','Send Your Enquiry':'发送咨询','Collect And Shoot':'取件拍摄',
    'Client Videos & Photo Snaps':'客户视频与照片','Travel Reel Highlight':'旅行短片精选','Event Coverage Clip':'活动拍摄片段','Client Photo Snapshot':'客户照片作品','Creator Shoot Result':'创作者拍摄成果',
    'Tutorial Videos':'教学视频','Learn & Master':'学习与掌握','Equipment Guides':'设备指南','General Tips & Techniques':'通用技巧',
    'Privacy Policy':'隐私政策','Shipping Policy':'配送政策','Terms & Conditions':'条款与条件','Last updated: August 2026':'最后更新：2026年8月','Information We May Collect':'我们可能收集的信息','How We Use Information':'我们如何使用信息','Sharing And Disclosure':'信息共享与披露','Data Retention And Security':'数据保存与安全','Cookies And Analytics':'Cookie 与分析',
    'Coverage And Delivery Method':'覆盖范围与配送方式','Processing And Scheduling':'处理与时间安排','Delivery Fees':'配送费用','Customer Responsibilities':'客户责任','Failed Delivery Or Changes':'配送失败或变更','Returns':'归还','Bookings And Availability':'预订与库存','Customer Information':'客户资料','Payment And Deposit':'付款与押金','Use Of Equipment':'设备使用','Returns, Late Return, Damage, Or Loss':'归还、逾期、损坏或遗失','Cancellations And Changes':'取消与更改','Limitation Of Liability':'责任限制','Sound off':'关闭声音','Sound on':'开启声音'
  };

  const zhTW = Object.assign({}, zhCN, {
    'Main Page':'首頁','Gear':'器材','Tutorial':'教學','Gallery':'作品集','Branches':'服務點','How It Works':'租賃流程','How it works':'租賃流程','FAQ':'常見問題','Contact':'聯絡我們','Browse Gear':'瀏覽器材','Gear list':'器材列表','Customer gallery':'客戶作品','Email us':'電郵聯絡','Enquiry form':'查詢表格','Compliance':'政策與條款','Privacy policy':'隱私政策','Shipping policy':'配送政策','T&C':'條款與細則',
    'Malaysia & Singapore creator gear rental':'馬來西亞與新加坡創作者器材租賃','Rent The':'租下','Shot.':'鏡頭。','Own The':'掌握','Moment.':'此刻。','pickup regions':'取件地區','customer reviews':'客戶評價','WhatsApp support':'WhatsApp 支援','Rent with confidence':'安心租賃','Creator gear, professionally prepared.':'專業準備的創作者器材。','Checked before handover':'交付前全面檢查','Clean, tested and shoot-ready':'清潔、測試完畢、隨取隨拍','Flexible collection':'彈性取件','Trusted by real renters':'真實租客信賴','Google and Facebook reviews':'Google 與 Facebook 真實評價',
    'Featured Collection':'精選系列','Explore Signature Gear':'探索精選器材','Creator Showcase':'創作者精選','Swipe Through Signature Setups':'滑動瀏覽精選套裝','Self-Pickup Near You':'就近自取','Self-Pickup Available':'支援自取','Campaign Story':'品牌故事','Guides From Our Feed':'社交平台實用指南','Follow On Xiaohongshu':'關注小紅書','Google Reviews':'Google 評價','What renters say':'租客怎麼說','Real reviews from our Google profile.':'來自 Google 商家頁面的真實評價。','Read All Reviews On Google':'查看全部 Google 評價',
    'Booking Enquiry':'租賃查詢','Book Your Gear':'預訂器材','Rental Enquiry - Confirmation via WhatsApp':'租賃查詢－透過 WhatsApp 確認','Your Name':'您的姓名','Equipment':'器材','Select equipment':'選擇器材','Other gear request':'其他器材需求','Start Date':'開始日期','End Date':'結束日期','Location / Area':'地點／地區','Select state':'選擇州屬','What are you shooting?':'您要拍攝什麼？','Proceed to WhatsApp':'前往 WhatsApp',
    'Facebook Reviews':'Facebook 評價','What Facebook customers say':'Facebook 客戶怎麼說','Visit Our Facebook Page':'瀏覽 Facebook 頁面','Gear Collection':'器材系列','Our':'我們的','Catalogue':'器材目錄','All Equipment':'全部器材','All':'全部','Drones':'無人機','Drone':'無人機','Action Cameras':'運動相機','Action Camera':'運動相機','360 Camera':'360 相機','Digital Cameras':'數碼相機','Digital Camera':'數碼相機','Accessories':'配件','Accessory':'配件','Watch Tutorials':'觀看教學','Browse the full collection and select any item to view details, included kit, and booking options.':'瀏覽完整器材系列，選擇產品即可查看詳情、套裝內容及預訂方式。','Explore every camera, drone and creator accessory currently listed by 94 EZY RENT. Select a device to see its details and book directly through WhatsApp.':'瀏覽 94 EZY RENT 現有的相機、無人機及創作者配件。選擇器材即可查看詳情，並透過 WhatsApp 直接預訂。','devices available':'台器材可供租用','View Details →':'查看詳情 →','← Back to all gear':'← 返回全部器材','Highlights':'產品亮點','Standard kit':'標準套裝','Book on WhatsApp':'透過 WhatsApp 預訂','Open enquiry form':'開啟查詢表格','Contact for rate':'聯絡我們取得報價','Availability and final rental pricing are confirmed personally by our team before booking.':'庫存和最終租金將在預訂前由我們的團隊親自確認。','Gear not found':'找不到器材','Please return to the catalogue and choose an available item.':'請返回器材目錄並選擇可用產品。','Frequently Asked Questions':'常見問題','How do I book a rental?':'如何預訂租賃？','Can you recommend gear for my shoot?':'可以為我的拍攝推薦器材嗎？','Do you provide beginner guidance?':'是否提供新手指導？','Which areas do you cover?':'服務覆蓋哪些地區？',
    'Simple Rental Flow':'簡單租賃流程','Browse The Gear':'瀏覽器材','Send Your Enquiry':'發送查詢','Collect And Shoot':'取件拍攝','Client Videos & Photo Snaps':'客戶影片與照片','Tutorial Videos':'教學影片','Learn & Master':'學習與掌握','Equipment Guides':'器材指南','General Tips & Techniques':'通用技巧','Privacy Policy':'隱私政策','Shipping Policy':'配送政策','Terms & Conditions':'條款與條件','Information We May Collect':'我們可能收集的資訊','How We Use Information':'我們如何使用資訊','Sharing And Disclosure':'資訊共享與披露','Data Retention And Security':'資料保存與安全','Sound off':'關閉聲音','Sound on':'開啟聲音'
  });

  const ms = {
    'Main Page':'Laman Utama','Gear':'Peralatan','Tutorial':'Panduan','Gallery':'Galeri','Branches':'Cawangan','How It Works':'Cara Ia Berfungsi','How it works':'Cara Ia Berfungsi','FAQ':'Soalan Lazim','Contact':'Hubungi','Browse Gear':'Lihat Peralatan','Explore':'Lihat','Reviews':'Ulasan','Social':'Sosial','Gear list':'Senarai peralatan','Customer gallery':'Galeri pelanggan','Email us':'E-mel kami','Enquiry form':'Borang pertanyaan','Compliance':'Polisi','Privacy policy':'Polisi privasi','Shipping policy':'Polisi penghantaran','T&C':'Terma & Syarat',
    'Camera, drone and vlog gear rental across Malaysia and Singapore. Shoot more, spend less.':'Sewaan kamera, dron dan peralatan vlog di Malaysia dan Singapura. Rakam lebih, belanja kurang.','Malaysia & Singapore creator gear rental':'Sewaan peralatan kreator Malaysia & Singapura','Rent The':'Sewa Untuk','Shot.':'Rakaman.','Own The':'Cipta','Moment.':'Detik Anda.',
    'Professional cameras, drones and creator kits—carefully checked, ready to shoot, and supported by a real local team.':'Kamera, dron dan kit kreator profesional—diperiksa rapi, sedia digunakan dan disokong oleh pasukan tempatan.','pickup regions':'kawasan ambil','Real':'Ulasan','customer reviews':'pelanggan sebenar','Fast':'Pantas','WhatsApp support':'sokongan WhatsApp','Rent with confidence':'Sewa dengan yakin','Creator gear, professionally prepared.':'Peralatan kreator yang disediakan secara profesional.','Checked before handover':'Diperiksa sebelum serahan','Clean, tested and shoot-ready':'Bersih, diuji dan sedia digunakan','Flexible collection':'Pengambilan fleksibel','Pickup, delivery and Lalamove':'Ambil sendiri, penghantaran dan Lalamove','Trusted by real renters':'Dipercayai penyewa sebenar','Google and Facebook reviews':'Ulasan Google dan Facebook',
    'Featured Collection':'Pilihan Utama','Explore Signature Gear':'Terokai Peralatan Pilihan','A curated selection of flagship creator gear, presented in a cleaner showroom-style layout so clients can compare standout models quickly before moving into enquiry.':'Pilihan peralatan kreator utama yang memudahkan anda membandingkan model sebelum membuat pertanyaan.','Creator Showcase':'Sorotan Kreator','Swipe Through Signature Setups':'Leret Untuk Lihat Set Pilihan','A more cinematic browse inspired by Porsche-style product storytelling. Swipe through short product loops, compare categories instantly, and jump straight into the gear that fits your shoot.':'Lihat video produk ringkas, bandingkan kategori dan pilih peralatan yang sesuai untuk rakaman anda.',
    'Self-Pickup Near You':'Pengambilan Berdekatan Anda','A more visual branch guide that makes self-pickup points clear at a glance, with animated markers that jump into focus when clients arrive at this section.':'Peta cawangan yang jelas untuk melihat lokasi pengambilan dengan pantas.','Self-Pickup Available':'Pengambilan Sendiri Tersedia','Malaysia-wide delivery and Lalamove support are available too. Message us on WhatsApp to confirm branch coverage, gear availability, and the most suitable pickup point for your shoot.':'Penghantaran seluruh Malaysia dan Lalamove turut tersedia. Hubungi kami melalui WhatsApp untuk mengesahkan liputan, stok dan lokasi pengambilan.',
    'Campaign Story':'Kisah Kempen','KOL Collabs, Ads & FM Features':'Kolaborasi KOL, Iklan & Liputan FM','Guides From Our Feed':'Panduan Daripada Media Sosial Kami','A curated RedNote guide wall for beginners, travellers, and content creators who want quick tips before renting the right gear.':'Panduan RedNote terpilih untuk pemula, pengembara dan pencipta kandungan sebelum menyewa peralatan.','Follow On Xiaohongshu':'Ikuti Di Xiaohongshu','Google Reviews':'Ulasan Google','What renters say':'Kata penyewa kami','Real reviews from our Google profile.':'Ulasan sebenar daripada profil Google kami.','Read All Reviews On Google':'Baca Semua Ulasan Google',
    'Booking Enquiry':'Pertanyaan Sewaan','Book Your Gear':'Tempah Peralatan Anda',"Fill in your rental details and we'll open WhatsApp with a pre-filled message, so you can confirm availability fast.":'Isi butiran sewaan dan WhatsApp akan dibuka dengan mesej siap diisi untuk semakan stok yang pantas.','Rental Enquiry - Confirmation via WhatsApp':'Pertanyaan Sewaan - Pengesahan melalui WhatsApp','Your Name':'Nama Anda','Equipment':'Peralatan','Select equipment':'Pilih peralatan','I need a recommendation - help me choose!':'Saya perlukan cadangan - bantu saya pilih!','Other gear request':'Permintaan peralatan lain','Start Date':'Tarikh Mula','End Date':'Tarikh Tamat','Location / Area':'Lokasi / Kawasan','Select state':'Pilih negeri','Outside Malaysia (SG / TW)':'Luar Malaysia (SG / TW)','Other / Custom area':'Kawasan lain','What are you shooting?':'Apakah jenis rakaman anda?','Wedding / Event':'Perkahwinan / Acara','Travel / Vlog':'Perjalanan / Vlog','Commercial / Ad':'Komersial / Iklan','Sports / Action':'Sukan / Aksi','Real Estate':'Hartanah','Other':'Lain-lain','Proceed to WhatsApp':'Teruskan ke WhatsApp',
    'Facebook Reviews':'Ulasan Facebook','What Facebook customers say':'Kata pelanggan Facebook','Real screenshot highlights from our Facebook page.':'Sorotan ulasan sebenar daripada halaman Facebook kami.','Visit Our Facebook Page':'Lawati Halaman Facebook Kami','Gear Collection':'Koleksi Peralatan','Our':'Koleksi','Catalogue':'Katalog','All Equipment':'Semua Peralatan','All':'Semua','Drones':'Dron','Drone':'Dron','Action Cameras':'Kamera Aksi','Action Camera':'Kamera Aksi','360 Camera':'Kamera 360','Digital Cameras':'Kamera Digital','Digital Camera':'Kamera Digital','Accessories':'Aksesori','Accessory':'Aksesori','Watch Tutorials':'Tonton Panduan','Browse the full collection and select any item to view details, included kit, and booking options.':'Lihat koleksi penuh dan pilih mana-mana peralatan untuk butiran, kandungan kit dan pilihan tempahan.','Explore every camera, drone and creator accessory currently listed by 94 EZY RENT. Select a device to see its details and book directly through WhatsApp.':'Terokai semua kamera, dron dan aksesori kreator yang disenaraikan oleh 94 EZY RENT. Pilih peralatan untuk melihat butiran dan tempah terus melalui WhatsApp.','devices available':'peralatan tersedia','View Details →':'Lihat Butiran →','← Back to all gear':'← Kembali ke semua peralatan','Highlights':'Sorotan','Standard kit':'Kit standard','Book on WhatsApp':'Tempah melalui WhatsApp','Open enquiry form':'Buka borang pertanyaan','Contact for rate':'Hubungi kami untuk harga','Availability and final rental pricing are confirmed personally by our team before booking.':'Ketersediaan dan harga sewaan akhir akan disahkan oleh pasukan kami sebelum tempahan.','Gear not found':'Peralatan tidak ditemui','Please return to the catalogue and choose an available item.':'Sila kembali ke katalog dan pilih peralatan yang tersedia.',
    'Frequently Asked Questions':'Soalan Lazim','Quick answers for clients who need to understand the rental process, collection details, and how to choose the right setup.':'Jawapan ringkas tentang proses sewaan, pengambilan dan pemilihan peralatan.','How do I book a rental?':'Bagaimana cara menempah?','Can you recommend gear for my shoot?':'Boleh cadangkan peralatan untuk rakaman saya?','Do you provide beginner guidance?':'Adakah panduan untuk pemula disediakan?','Which areas do you cover?':'Kawasan manakah yang diliputi?','What if I am not sure how long I need the gear?':'Bagaimana jika saya tidak pasti tempoh sewaan?','Where can I contact your team?':'Bagaimana menghubungi pasukan anda?',
    'Browse the gear, submit the booking enquiry form, or contact us on WhatsApp. We confirm the dates, advise the best setup if needed, and arrange collection.':'Lihat peralatan, hantar borang pertanyaan atau hubungi kami melalui WhatsApp. Kami akan mengesahkan tarikh, mencadangkan set yang sesuai dan mengatur pengambilan.','Yes. Tell us what you are filming, where the shoot is happening, and what type of result you want. We can suggest the right camera, drone, or accessory combination.':'Ya. Beritahu kami jenis rakaman, lokasi dan hasil yang diinginkan. Kami akan mencadangkan gabungan kamera, dron atau aksesori yang sesuai.','Yes. We can explain basic setup, key functions, and handling tips so first-time renters feel more confident before the shoot starts.':'Ya. Kami akan menerangkan tetapan asas, fungsi utama dan cara penggunaan untuk penyewa kali pertama.','Use the contact section at the bottom of the main page or message us on WhatsApp for the fastest response.':'Gunakan bahagian hubungi di bawah laman utama atau mesej kami melalui WhatsApp untuk respons terpantas.',
    'Simple Rental Flow':'Proses Sewaan Mudah','A polished rental journey designed to keep every step clear, fast, and professional from gear selection to return.':'Proses yang jelas, pantas dan profesional daripada pemilihan hingga pemulangan peralatan.','Browse The Gear':'Lihat Peralatan','Send Your Enquiry':'Hantar Pertanyaan','Collect And Shoot':'Ambil Dan Rakam','Client Videos & Photo Snaps':'Video & Foto Pelanggan','Travel Reel Highlight':'Sorotan Video Perjalanan','Event Coverage Clip':'Klip Liputan Acara','Client Photo Snapshot':'Foto Pelanggan','Creator Shoot Result':'Hasil Rakaman Kreator','Tutorial Videos':'Video Panduan','Learn & Master':'Belajar & Kuasai','Equipment Guides':'Panduan Peralatan','General Tips & Techniques':'Tip & Teknik Umum',
    'Privacy Policy':'Polisi Privasi','Shipping Policy':'Polisi Penghantaran','Terms & Conditions':'Terma & Syarat','Last updated: August 2026':'Kemas kini terakhir: Ogos 2026','Information We May Collect':'Maklumat Yang Mungkin Dikumpul','How We Use Information':'Cara Kami Menggunakan Maklumat','Sharing And Disclosure':'Perkongsian Dan Pendedahan','Data Retention And Security':'Penyimpanan Dan Keselamatan Data','Cookies And Analytics':'Kuki Dan Analitik','Coverage And Delivery Method':'Liputan Dan Kaedah Penghantaran','Processing And Scheduling':'Pemprosesan Dan Penjadualan','Delivery Fees':'Caj Penghantaran','Customer Responsibilities':'Tanggungjawab Pelanggan','Failed Delivery Or Changes':'Penghantaran Gagal Atau Perubahan','Returns':'Pemulangan','Bookings And Availability':'Tempahan Dan Ketersediaan','Customer Information':'Maklumat Pelanggan','Payment And Deposit':'Bayaran Dan Deposit','Use Of Equipment':'Penggunaan Peralatan','Returns, Late Return, Damage, Or Loss':'Pemulangan, Kelewatan, Kerosakan Atau Kehilangan','Cancellations And Changes':'Pembatalan Dan Perubahan','Limitation Of Liability':'Had Liabiliti','Sound off':'Bunyi dimatikan','Sound on':'Bunyi dihidupkan'
  };

  const dictionaries = {'zh-CN': zhCN, 'zh-TW': zhTW, ms};
  const skippedTags = new Set(['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA']);
  let currentLanguage = DEFAULT_LANGUAGE;
  let applying = false;

  function translateRoot(root, language) {
    if (!(root instanceof Node)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || skippedTags.has(parent.tagName) || parent.closest('[data-i18n-ignore]')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }});
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!Object.prototype.hasOwnProperty.call(node, '__i18nOriginal')) node.__i18nOriginal = node.nodeValue;
      const original = node.__i18nOriginal;
      const trimmed = original.trim();
      const translated = dictionaries[language]?.[trimmed] || trimmed;
      node.nodeValue = original.replace(trimmed, translated);
    });
  }

  function applyLanguage(language) {
    if (!languages[language]) language = DEFAULT_LANGUAGE;
    currentLanguage = language;
    applying = true;
    document.documentElement.lang = languages[language].html;
    document.body.dataset.language = language;
    translateRoot(document.body, language);
    const select = document.getElementById('site-language-select');
    if (select instanceof HTMLSelectElement) select.value = language;
    try { localStorage.setItem(STORAGE_KEY, language); } catch (_) {}
    applying = false;
    document.dispatchEvent(new CustomEvent('site:languagechange', {detail:{language}}));
  }

  function createSwitcher() {
    const navInner = document.querySelector('nav .nav-inner');
    if (!(navInner instanceof HTMLElement) || document.getElementById('site-language-select')) return;
    const wrapper = document.createElement('label');
    wrapper.className = 'language-switcher';
    wrapper.dataset.i18nIgnore = '';
    wrapper.innerHTML = `<select id="site-language-select" aria-label="Language">${Object.entries(languages).map(([code,meta])=>`<option value="${code}">${meta.label}</option>`).join('')}</select>`;
    navInner.appendChild(wrapper);
    wrapper.querySelector('select').addEventListener('change', (event) => applyLanguage(event.target.value));
  }

  function initialise() {
    createSwitcher();
    let stored = DEFAULT_LANGUAGE;
    try { stored = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE; } catch (_) {}
    applyLanguage(stored);
    new MutationObserver((mutations) => {
      if (applying || currentLanguage === DEFAULT_LANGUAGE) return;
      applying = true;
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => translateRoot(node, currentLanguage)));
      applying = false;
    }).observe(document.body,{childList:true,subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
})();
