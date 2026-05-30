import type { SymptomTree } from "@/data/types";

/**
 * Client-side symptom decision tree. Each species has body-area nodes (level 1),
 * each area has symptom nodes (level 2) that terminate in an outcome.
 * Outcomes give a plain-language assessment, a see-vet flag, and 0-3 product ids.
 * This is informational only and never replaces a real vet examination.
 */
export const symptomTree: SymptomTree = {
	dog: [
		{
			id: "dog-digestion",
			label: "Pencernaan",
			children: [
				{
					id: "dog-dig-vomit",
					label: "Muntah sesekali",
					outcome: {
						assessment:
							"Muntah satu atau dua kali bisa terjadi karena makan terlalu cepat atau ganti makanan. Pantau selama 24 jam dan beri porsi kecil.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-dig-diarrhea",
					label: "Diare ringan",
					outcome: {
						assessment:
							"Diare ringan sering membaik dengan makanan yang lembut dan cukup cairan. Jika berlanjut lebih dari dua hari, periksakan ke dokter hewan.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-dig-bloody",
					label: "Muntah atau diare berdarah",
					outcome: {
						assessment:
							"Adanya darah pada muntah atau kotoran adalah tanda serius. Hewan perlu diperiksa dokter hewan secepatnya.",
						seeVet: "yes",
					},
				},
				{
					id: "dog-dig-appetite",
					label: "Nafsu makan menurun",
					outcome: {
						assessment:
							"Nafsu makan yang menurun bisa karena banyak hal. Coba bantu dengan suplemen penambah energi dan amati selama sehari.",
						seeVet: "maybe",
					},
				},
			],
		},
		{
			id: "dog-skin",
			label: "Kulit dan Bulu",
			children: [
				{
					id: "dog-skin-itch",
					label: "Sering menggaruk",
					outcome: {
						assessment:
							"Gatal sering disebabkan kutu atau kulit kering. Mandi dengan sampo menenangkan dan periksa adanya kutu.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-skin-fleas",
					label: "Terlihat kutu atau caplak",
					outcome: {
						assessment:
							"Kutu dan caplak perlu segera ditangani agar tidak menyebar. Gunakan obat tetes anti parasit sesuai berat badan.",
						seeVet: "no",
					},
				},
				{
					id: "dog-skin-hairloss",
					label: "Bulu rontok berlebihan",
					outcome: {
						assessment:
							"Rontok berlebih bisa terkait nutrisi. Tambahkan omega dan sisir rutin. Bila ada luka atau kebotakan, periksakan ke dokter hewan.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-skin-wound",
					label: "Luka terbuka atau bernanah",
					outcome: {
						assessment:
							"Luka terbuka berisiko infeksi dan sebaiknya ditangani dokter hewan untuk pembersihan yang tepat.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "dog-ears",
			label: "Telinga",
			children: [
				{
					id: "dog-ear-shake",
					label: "Sering menggeleng kepala",
					outcome: {
						assessment:
							"Sering menggeleng bisa karena telinga kotor atau gatal. Bersihkan dengan cairan pembersih telinga khusus.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-ear-smell",
					label: "Telinga bau dan kotor",
					outcome: {
						assessment:
							"Bau pada telinga bisa menandakan infeksi. Bersihkan secara lembut, dan bila bau menetap periksakan ke dokter hewan.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-ear-pain",
					label: "Terlihat kesakitan saat disentuh",
					outcome: {
						assessment:
							"Rasa sakit di telinga sering menandakan infeksi yang sudah cukup parah dan butuh penanganan dokter hewan.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "dog-mouth",
			label: "Mulut dan Gigi",
			children: [
				{
					id: "dog-mouth-breath",
					label: "Napas berbau tidak sedap",
					outcome: {
						assessment:
							"Napas bau biasanya karena penumpukan karang gigi. Mulai rutinitas sikat gigi dan camilan dental.",
						seeVet: "no",
					},
				},
				{
					id: "dog-mouth-gums",
					label: "Gusi merah atau berdarah",
					outcome: {
						assessment:
							"Gusi yang merah atau berdarah menandakan radang gusi yang perlu diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "dog-mouth-chew",
					label: "Enggan mengunyah makanan keras",
					outcome: {
						assessment:
							"Enggan mengunyah bisa karena gigi nyeri. Coba makanan yang lebih lembut sambil menjadwalkan pemeriksaan gigi.",
						seeVet: "maybe",
					},
				},
			],
		},
		{
			id: "dog-energy",
			label: "Energi dan Gerak",
			children: [
				{
					id: "dog-energy-lethargy",
					label: "Lesu dan kurang aktif",
					outcome: {
						assessment:
							"Lesu ringan bisa karena cuaca atau kurang nutrisi. Bila disertai gejala lain atau menetap, periksakan ke dokter hewan.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-energy-limp",
					label: "Pincang atau kaku saat bergerak",
					outcome: {
						assessment:
							"Kaku pada sendi umum pada anjing tua. Suplemen sendi membantu, tetapi pincang mendadak sebaiknya diperiksa dokter hewan.",
						seeVet: "maybe",
					},
				},
				{
					id: "dog-energy-collapse",
					label: "Tiba-tiba lemas atau pingsan",
					outcome: {
						assessment:
							"Lemas mendadak atau pingsan adalah keadaan darurat. Segera bawa ke dokter hewan terdekat.",
						seeVet: "yes",
					},
				},
			],
		},
	],
	cat: [
		{
			id: "cat-digestion",
			label: "Pencernaan",
			children: [
				{
					id: "cat-dig-hairball",
					label: "Memuntahkan hairball",
					outcome: {
						assessment:
							"Hairball sesekali itu normal pada kucing. Pakan anti hairball dan menyisir rutin membantu menguranginya.",
						seeVet: "no",
					},
				},
				{
					id: "cat-dig-vomit",
					label: "Muntah berulang",
					outcome: {
						assessment:
							"Muntah yang berulang dalam sehari perlu diwaspadai. Puasakan makanan beberapa jam dan amati. Bila terus berlanjut, periksakan.",
						seeVet: "maybe",
					},
				},
				{
					id: "cat-dig-noeat",
					label: "Tidak mau makan lebih dari sehari",
					outcome: {
						assessment:
							"Kucing yang tidak makan lebih dari 24 jam berisiko masalah hati. Sebaiknya segera diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "cat-urinary",
			label: "Saluran Kemih",
			children: [
				{
					id: "cat-urin-frequent",
					label: "Bolak-balik ke litter box",
					outcome: {
						assessment:
							"Sering ke litter box tanpa hasil bisa menandakan masalah saluran kemih. Pastikan minum cukup dan amati dengan saksama.",
						seeVet: "maybe",
					},
				},
				{
					id: "cat-urin-blood",
					label: "Ada darah pada urin",
					outcome: {
						assessment:
							"Darah pada urin adalah tanda serius pada kucing dan butuh pemeriksaan dokter hewan secepatnya.",
						seeVet: "yes",
					},
				},
				{
					id: "cat-urin-strain",
					label: "Mengejan tanpa keluar urin",
					outcome: {
						assessment:
							"Tidak bisa buang air kecil adalah keadaan darurat, terutama pada kucing jantan. Segera ke dokter hewan.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "cat-skin",
			label: "Kulit dan Bulu",
			children: [
				{
					id: "cat-skin-scratch",
					label: "Sering menggaruk leher",
					outcome: {
						assessment:
							"Garukan di leher sering disebabkan kutu. Periksa adanya kutu dan gunakan perlindungan anti parasit.",
						seeVet: "maybe",
					},
				},
				{
					id: "cat-skin-overgroom",
					label: "Menjilati satu area berlebihan",
					outcome: {
						assessment:
							"Menjilati berlebihan bisa karena gatal atau stres. Tambahkan omega untuk kulit dan kurangi pemicu stres di rumah.",
						seeVet: "maybe",
					},
				},
				{
					id: "cat-skin-bald",
					label: "Muncul bagian botak",
					outcome: {
						assessment:
							"Kebotakan setempat bisa terkait jamur atau alergi dan sebaiknya diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "cat-eyes",
			label: "Mata",
			children: [
				{
					id: "cat-eye-watery",
					label: "Mata berair",
					outcome: {
						assessment:
							"Mata berair ringan bisa karena debu. Bersihkan lembut dengan kapas basah dan amati selama beberapa hari.",
						seeVet: "maybe",
					},
				},
				{
					id: "cat-eye-discharge",
					label: "Kotoran mata kental",
					outcome: {
						assessment:
							"Kotoran mata yang kental atau berwarna bisa menandakan infeksi. Sebaiknya diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "cat-eye-squint",
					label: "Sering memicingkan mata",
					outcome: {
						assessment:
							"Memicingkan mata menandakan rasa tidak nyaman atau nyeri. Periksakan untuk memastikan tidak ada luka pada mata.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "cat-mouth",
			label: "Mulut dan Gigi",
			children: [
				{
					id: "cat-mouth-breath",
					label: "Napas berbau",
					outcome: {
						assessment:
							"Napas bau pada kucing sering karena karang gigi. Mulai perawatan gigi rutin di rumah.",
						seeVet: "no",
					},
				},
				{
					id: "cat-mouth-drool",
					label: "Mengeluarkan air liur berlebih",
					outcome: {
						assessment:
							"Air liur berlebih bisa menandakan nyeri mulut atau gigi. Sebaiknya diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "cat-mouth-paw",
					label: "Sering mencakar area mulut",
					outcome: {
						assessment:
							"Mencakar mulut bisa karena ada yang tersangkut atau nyeri gigi. Periksa dengan hati-hati dan konsultasikan bila perlu.",
						seeVet: "maybe",
					},
				},
			],
		},
	],
	rabbit: [
		{
			id: "rabbit-digestion",
			label: "Pencernaan",
			children: [
				{
					id: "rabbit-dig-noeat",
					label: "Berhenti makan",
					outcome: {
						assessment:
							"Kelinci yang berhenti makan adalah keadaan darurat karena pencernaannya bisa berhenti total. Segera ke dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "rabbit-dig-softpoop",
					label: "Kotoran lembek",
					outcome: {
						assessment:
							"Kotoran lembek sering karena terlalu banyak makanan manis. Perbanyak rumput kering dan kurangi buah.",
						seeVet: "maybe",
					},
				},
				{
					id: "rabbit-dig-nopoop",
					label: "Tidak ada kotoran sama sekali",
					outcome: {
						assessment:
							"Tidak buang kotoran menandakan saluran cerna berhenti bekerja. Ini darurat dan butuh penanganan segera.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "rabbit-teeth",
			label: "Gigi",
			children: [
				{
					id: "rabbit-teeth-drool",
					label: "Air liur membasahi dagu",
					outcome: {
						assessment:
							"Air liur berlebih pada kelinci sering karena gigi yang tumbuh berlebih. Perlu diperiksa dan dirapikan dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "rabbit-teeth-hard",
					label: "Sulit mengunyah",
					outcome: {
						assessment:
							"Kesulitan mengunyah bisa karena gigi tidak rata. Sediakan rumput kering tanpa batas dan jadwalkan pemeriksaan gigi.",
						seeVet: "maybe",
					},
				},
				{
					id: "rabbit-teeth-weight",
					label: "Berat badan menurun",
					outcome: {
						assessment:
							"Penurunan berat badan pada kelinci perlu diperhatikan serius dan sebaiknya diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
			],
		},
		{
			id: "rabbit-skin",
			label: "Kulit dan Bulu",
			children: [
				{
					id: "rabbit-skin-scratch",
					label: "Sering menggaruk",
					outcome: {
						assessment:
							"Garukan bisa karena tungau. Periksa kulit dan telinga, dan konsultasikan penanganan yang aman untuk kelinci.",
						seeVet: "maybe",
					},
				},
				{
					id: "rabbit-skin-bald",
					label: "Bulu rontok berbercak",
					outcome: {
						assessment:
							"Kerontokan berbercak bisa menandakan tungau atau jamur dan sebaiknya diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "rabbit-skin-dirty",
					label: "Bulu kotor di bagian belakang",
					outcome: {
						assessment:
							"Bagian belakang yang kotor bisa menandakan kelinci sulit membersihkan diri. Jaga kebersihan dan periksa pola makannya.",
						seeVet: "maybe",
					},
				},
			],
		},
		{
			id: "rabbit-behavior",
			label: "Perilaku",
			children: [
				{
					id: "rabbit-beh-hide",
					label: "Bersembunyi terus menerus",
					outcome: {
						assessment:
							"Kelinci memang suka bersembunyi, tetapi bila disertai tidak makan, itu tanda sakit yang perlu segera diperiksa.",
						seeVet: "maybe",
					},
				},
				{
					id: "rabbit-beh-quiet",
					label: "Membungkuk dan diam",
					outcome: {
						assessment:
							"Postur membungkuk dan diam sering menandakan nyeri pada kelinci. Sebaiknya segera diperiksa dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "rabbit-beh-aggressive",
					label: "Tiba-tiba agresif",
					outcome: {
						assessment:
							"Perubahan perilaku mendadak bisa karena rasa sakit atau stres. Amati lingkungannya dan konsultasikan bila menetap.",
						seeVet: "maybe",
					},
				},
			],
		},
		{
			id: "rabbit-breathing",
			label: "Pernapasan",
			children: [
				{
					id: "rabbit-breath-sneeze",
					label: "Sering bersin",
					outcome: {
						assessment:
							"Bersin sesekali bisa karena debu serbuk pakan. Bila sering dan disertai ingus, sebaiknya diperiksa dokter hewan.",
						seeVet: "maybe",
					},
				},
				{
					id: "rabbit-breath-nose",
					label: "Hidung berair atau berlendir",
					outcome: {
						assessment:
							"Hidung berlendir pada kelinci bisa menandakan infeksi saluran napas yang butuh penanganan dokter hewan.",
						seeVet: "yes",
					},
				},
				{
					id: "rabbit-breath-fast",
					label: "Napas cepat dan berat",
					outcome: {
						assessment:
							"Napas yang cepat dan berat adalah keadaan darurat pada kelinci. Segera bawa ke dokter hewan.",
						seeVet: "yes",
					},
				},
			],
		},
	],
};

export const symptomSpecies: { key: string; label: string }[] = [
	{ key: "dog", label: "Anjing" },
	{ key: "cat", label: "Kucing" },
	{ key: "rabbit", label: "Kelinci" },
];
