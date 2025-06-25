/**
 * =================================
 * GPA Calculator - Main Logic
 * =================================
 * This script handles all the application logic, including:
 * - State management (saving/loading settings)
 * - UI updates and translations
 * - Event handling for user interactions
 * - Calculation logic for semester and annual GPA
 * - Dynamic component loading
 * =================================
 */

// This function runs once the main HTML document is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- Component Loading ---
    // List of all HTML components to be loaded into the main page.
    const components = [
        'main-page.html',
        'semester-calculator-page.html',
        'annual-calculator-page.html',
        'settings-page.html',
        'contact-modal.html',
        'module-modal.html',
        'result-modal.html',
        'statement-modal.html',
        'alert-modal.html'
    ];

    /**
     * Asynchronously loads all HTML components from the 'components' folder
     * and injects them into the main app container.
     */
    async function loadComponents() {
        const appContainer = document.getElementById('calculator-app');
        if (!appContainer) {
            console.error('Fatal Error: App container not found.');
            return;
        }

        // Create an array of fetch promises
        const fetchPromises = components.map(component =>
            fetch(`components/${component}`).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${component}`);
                }
                return response.text();
            })
        );

        try {
            // Wait for all components to be fetched
            const htmlContents = await Promise.all(fetchPromises);
            // Join them and inject into the container
            appContainer.innerHTML = htmlContents.join('');
            // Once all components are loaded, initialize the main application logic
            initializeApp();
        } catch (error) {
            console.error("Could not load app components:", error);
            appContainer.innerHTML = `<p style="text-align: center; padding: 2rem; color: red;">Error: Could not load application components. Please check the file paths and network connection.</p>`;
        }
    }

    /**
     * Initializes the entire application after components are loaded.
     * Sets up translations, state, event listeners, etc.
     */
    function initializeApp() {
        // --- DOM Helpers ---
        const get = (selector) => document.querySelector(selector);
        const getAll = (selector) => document.querySelectorAll(selector);

        // --- Translations ---
        const translations = {
            ar: {
                main_title: 'حاسبة المعدل الجامعي',
                semester_gpa_card_title: 'المعدل الفصلي',
                semester_gpa_card_desc: 'حساب معدل السداسي الواحد',
                annual_gpa_card_title: 'المعدل السنوي',
                annual_gpa_card_desc: 'حساب المعدل العام للسنة',
                settings: 'الإعدادات',
                semester_gpa_title: 'حساب المعدل الفصلي',
                annual_gpa_title: 'حساب المعدل السنوي',
                no_modules_yet: 'لم تتم إضافة أي مقياس بعد.',
                add_new_module: '+ إضافة مقياس جديد',
                delete_all_modules: 'حذف كل المقاييس',
                show_result: 'إظهار النتيجة',
                s1_title: 'الفصل الأول',
                s2_title: 'الفصل الثاني',
                gpa_placeholder: 'المعدل',
                credits_placeholder: 'الرصيد',
                calculation_method: 'طريقة الحساب',
                set_credits: 'تحديد الرصيد',
                set_credits_desc: 'يرجى تحديد الحد الأدنى للرصيد السنوي المطلوب للإنتقال إلى السنة الموالية، حسب متطلبات كليتك.',
                credits_option_30: "الرصيد السنوي المطلوب للإنتقال 30",
                credits_option_45: "الرصيد السنوي المطلوب للإنتقال 45",
                theme: 'المظهر',
                auto_theme: 'تلقائي',
                light_theme: 'الفاتح',
                dark_theme: 'الداكن',
                language: 'اللغة',
                lang_ar: 'العربية',
                lang_en: 'English',
                lang_fr: 'Français',
                save_changes: 'حفظ التغييرات',
                contact_us: 'تواصل معنا',
                about_app: 'عن التطبيق',
                about_p1: 'هذا التطبيق مخصص لمساعدة الطلاب الجزائريين على حساب معدلاتهم الفصليّة والسنويّة بدقة وسهولة، باستخدام طرق حساب متعددة تناسب مختلف الجامعات.',
                about_p2: 'هل لديك أي أفكار أو اقتراحات حول التطبيق؟ سأكون ممتنًا لأي ردود فعل تساعدني في تطوير التطبيق وتلبية احتياجات المستخدمين بشكل أفضل.',
                feedback_placeholder: 'اكتب اقتراحك هنا...',
                send_feedback: 'إرسال الاقتراح',
                contact_dev: 'تواصل مع المطور',
                contact_by: "هذا التطبيق من طرف \"ب.مـحـمـد\"",
                contact_p1: "تم تصميم هذا المشروع بعناية لتسهيل عملية حساب المعدل الفصلي والسنوي بطريقة دقيقة وسهلة الإستخدام، بهدف خدمة الطلبة وتوفير الوقت والتجربة المريحة والفعالة في تنظيم نتائجهم الدراسية.",
                contact_p2: "يسعدني دائمًا أن أكون على تواصل معكم، وأشكر كل من يختار متابعتي، فوجودكم ومتابعتكم لي هو الدافع الأكبر للاستمرار وتقديم الأفضل دائمًا.",
                contact_p3: "يمكنكم مراسلتي من خلال الروابط أدناه، وسأكون سعيدًا بقراءة رسائلكم والتفاعل معكم بكل حب واحترام.",
                add_module_title: 'إضافة مقياس جديد',
                edit_module_title: 'تعديل المقياس',
                module_name_label: 'اسم المقياس',
                module_name_placeholder: 'مثال: تحليل 1',
                coeff_label: 'المعامل',
                credits_label: 'الرصيد',
                example_placeholder_2: 'مثال: 2',
                calc_module_gpa: 'حساب معدل المقياس',
                save: 'حفظ',
                cancel: 'إلغاء',
                final_result: 'النتيجة النهائية',
                semester_result_title: 'نتيجة الفصل',
                annual_result_title: 'النتيجة السنوية',
                result_label: 'النتيجة',
                credits_label_result: 'الرصيد',
                remark_label: 'الملاحظة',
                view_statement_title: 'عرض كشف النقاط',
                save_statement_title: 'حفظ كشف النقاط كصورة',
                statement_title: 'كشف النقاط',
                module_th: 'المقياس',
                credits_th: 'الرصيد',
                coeff_th: 'المعامل',
                grade_th: 'المعدل',
                semester_gpa_summary: 'المعدل الفصلي',
                earned_credits_summary: 'الرصيد المحصل',
                remark_summary: 'الملاحظة',
                alert_title: 'تنبيه',
                confirm: 'تأكيد',
                edit: 'تعديل',
                delete: 'حذف',
                confirm_delete_all_modules: 'هل أنت متأكد من أنك تريد حذف جميع المقاييس المسجلة؟',
                confirm_change_calc_method: 'تغيير طريقة الحساب سيؤدي إلى حذف جميع المقاييس المضافة. هل تريد المتابعة؟',
                confirm_change_credits_req: 'تغيير رصيد الانتقال سيؤدي إلى مسح بيانات المعدل السنوي المدخلة. هل تريد المتابعة؟',
                error_no_modules: 'الرجاء إضافة مقياس واحد على الأقل.',
                error_invalid_annual_values: 'الرجاء إدخال قيم صحيحة لجميع الحقول المطلوبة.',
                error_max_modules: 'لا يمكن إضافة أكثر من 15 مقياسًا.',
                error_fill_all_fields: 'يرجى تعبئة جميع الحقول المطلوبة.',
                error_grade_invalid: 'يجب تفعيل وإدخال نقطة واحدة صالحة على الأقل (بين 0 و 20).',
                error_feedback_empty: 'الرجاء كتابة اقتراحك أولاً.',
                feedback_sent_success: 'نشكرك على إرسال إقتراحك لنا وسنأخذه بعين الاعتبار.',
                feedback_sent_error: 'عذرا، حدث خطأ أثناء إرسال اقتراحك. يرجى المحاولة مرة أخرى.',
                error_offline: 'لا يوجد اتصال بالانترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
                ok_btn: 'حسناً',
                success_title: 'نجاح',
                remark_excellent: 'ممتاز',
                remark_very_good: 'جيد جدًا',
                remark_good: 'جيد',
                remark_fairly_good: 'قريب من الجيد',
                remark_pass: 'مقبول',
                remark_resit: 'استدراك',
                remark_poor: 'ضعيف',
                status_pass: 'ناجح ومنتقل',
                status_debt: 'ناجح بالديون',
                status_fail: 'إعادة السنة'
            },
            en: {
                main_title: 'GPA Calculator',
                semester_gpa_card_title: 'Semester GPA',
                semester_gpa_card_desc: 'Calculate your semester GPA',
                annual_gpa_card_title: 'Annual GPA',
                annual_gpa_card_desc: 'Calculate your annual GPA',
                settings: 'Settings',
                semester_gpa_title: 'Semester GPA Calculation',
                annual_gpa_title: 'Annual GPA Calculation',
                no_modules_yet: 'No modules added yet.',
                add_new_module: '+ Add New Module',
                delete_all_modules: 'Delete All Modules',
                show_result: 'Show Result',
                s1_title: 'Semester 1',
                s2_title: 'Semester 2',
                gpa_placeholder: 'GPA',
                credits_placeholder: 'Credits',
                calculation_method: 'Calculation Method',
                set_credits: 'Set Required Credits',
                set_credits_desc: 'Please select the minimum annual credits required to pass with debt, according to your faculty.',
                credits_option_30: "Required annual credits to pass is 30",
                credits_option_45: "Required annual credits to pass is 45",
                theme: 'Theme',
                auto_theme: 'Auto',
                light_theme: 'Light',
                dark_theme: 'Dark',
                language: 'Language',
                lang_ar: 'العربية',
                lang_en: 'English',
                lang_fr: 'Français',
                save_changes: 'Save Changes',
                contact_us: 'Contact Us',
                about_app: 'About App',
                about_p1: 'This application is designed to help Algerian students calculate their semester and annual GPAs accurately and easily, using multiple calculation methods to suit different universities.',
                about_p2: 'Do you have any ideas or suggestions about the app? I would be grateful for any feedback to help me improve the application and better meet user needs.',
                feedback_placeholder: 'Write your suggestion here...',
                send_feedback: 'Send Suggestion',
                contact_dev: 'Contact Developer',
                contact_by: "This application is by \"B. Mohamed\"",
                contact_p1: "This project was carefully designed to facilitate the process of calculating semester and annual averages in an accurate and user-friendly way, aiming to serve students, save time, and provide a comfortable and efficient experience in organizing their academic results.",
                contact_p2: "I am always happy to be in touch with you, and I thank everyone who chooses to follow me. Your presence and your follow-up are the biggest motivation to continue and always provide the best.",
                contact_p3: "You can contact me through the links below, and I will be happy to read your messages and interact with you with all love and respect.",
                add_module_title: 'Add New Module',
                edit_module_title: 'Edit Module',
                module_name_label: 'Module Name',
                module_name_placeholder: 'e.g., Analysis 1',
                coeff_label: 'Coefficient',
                credits_label: 'Credits',
                example_placeholder_2: 'e.g., 2',
                calc_module_gpa: 'Calculate Module Grade',
                save: 'Save',
                cancel: 'Cancel',
                final_result: 'Final Result',
                semester_result_title: 'Semester Result',
                annual_result_title: 'Annual Result',
                result_label: 'Result',
                credits_label_result: 'Credits',
                remark_label: 'Remark',
                view_statement_title: 'View Statement of Marks',
                save_statement_title: 'Save Statement as Image',
                statement_title: 'Statement of Marks',
                module_th: 'Module',
                credits_th: 'Credits',
                coeff_th: 'Coeff.',
                grade_th: 'Grade',
                semester_gpa_summary: 'Semester GPA',
                earned_credits_summary: 'Earned Credits',
                remark_summary: 'Remark',
                alert_title: 'Warning',
                confirm: 'Confirm',
                edit: 'Edit',
                delete: 'Delete',
                confirm_delete_all_modules: 'Are you sure you want to delete all registered modules?',
                confirm_change_calc_method: 'Changing the calculation method will delete all added modules. Do you want to continue?',
                confirm_change_credits_req: 'Changing the required credits will clear the entered annual GPA data. Do you want to continue?',
                error_no_modules: 'Please add at least one module.',
                error_invalid_annual_values: 'Please enter valid values for all required fields.',
                error_max_modules: 'Cannot add more than 15 modules.',
                error_fill_all_fields: 'Please fill all required fields.',
                error_grade_invalid: 'At least one valid grade (between 0 and 20) must be enabled and entered.',
                error_feedback_empty: 'Please write your suggestion first.',
                feedback_sent_success: 'Thank you for submitting your suggestion. We will take it into consideration.',
                feedback_sent_error: 'Oops! There was a problem submitting your form. Please try again.',
                error_offline: 'No internet connection detected. Please check your connection and try again.',
                ok_btn: 'OK',
                success_title: 'Success',
                remark_excellent: 'Excellent',
                remark_very_good: 'Very Good',
                remark_good: 'Good',
                remark_fairly_good: 'Fairly Good',
                remark_pass: 'Pass',
                remark_resit: 'Resit',
                remark_poor: 'Poor',
                status_pass: 'Promoted',
                status_debt: 'Promoted with Debt',
                status_fail: 'Repeat Year'
            },
            fr: {
                main_title: 'Calculatrice de Moyenne',
                semester_gpa_card_title: 'Moyenne Semestrielle',
                semester_gpa_card_desc: 'Calculer la moyenne du semestre',
                annual_gpa_card_title: 'Moyenne Annuelle',
                annual_gpa_card_desc: 'Calculer la moyenne générale de l\'année',
                settings: 'Paramètres',
                semester_gpa_title: 'Calcul de la Moyenne Semestrielle',
                annual_gpa_title: 'Calcul de la Moyenne Annuelle',
                no_modules_yet: 'Aucun module ajouté pour le moment.',
                add_new_module: '+ Ajouter un Nouveau Module',
                delete_all_modules: 'Supprimer tous les modules',
                show_result: 'Afficher le Résultat',
                s1_title: 'Semestre 1',
                s2_title: 'Semestre 2',
                gpa_placeholder: 'Moyenne',
                credits_placeholder: 'Crédits',
                calculation_method: 'Méthode de Calcul',
                set_credits: 'Définir les Crédits',
                set_credits_desc: 'Veuillez sélectionner le nombre de crédits annuels requis pour passer avec dettes, selon votre faculté.',
                credits_option_30: "Les crédits annuels requis pour passer sont de 30",
                credits_option_45: "Les crédits annuels requis pour passer sont de 45",
                theme: 'Thème',
                auto_theme: 'Auto',
                light_theme: 'Clair',
                dark_theme: 'Sombre',
                language: 'Langue',
                lang_ar: 'العربية',
                lang_en: 'English',
                lang_fr: 'Français',
                save_changes: 'Enregistrer les modifications',
                contact_us: 'Nous Contacter',
                about_app: 'À Propos',
                about_p1: 'Cette application est conçue pour aider les étudiants algériens à calculer leurs moyennes semestrielles et annuelles avec précision et facilité, en utilisant plusieurs méthodes de calcul adaptées aux différentes universités.',
                about_p2: 'Avez-vous des idées ou des suggestions concernant l\'application ? Je serais reconnaissant de tout retour qui m\'aiderait à améliorer l\'application et à mieux répondre aux besoins des utilisateurs.',
                feedback_placeholder: 'Écrivez votre suggestion ici...',
                send_feedback: 'Envoyer la Suggestion',
                contact_dev: 'Contacter le Développeur',
                contact_by: "Cette application est réalisée par « B. Mohamed »",
                contact_p1: "Ce projet a été soigneusement conçu pour faciliter le calcul des moyennes semestrielles et annuelles de manière précise et conviviale, dans le but de servir les étudiants, de gagner du temps et d'offrir une expérience confortable et efficace dans l'organisation de leurs résultats académiques.",
                contact_p2: "Je suis toujours heureux d'être en contact avec vous, et je remercie tous ceux qui choisissent de me suivre. Votre présence et votre suivi sont la plus grande motivation pour continuer et toujours offrir le meilleur.",
                contact_p3: "Vous pouvez me contacter via les liens ci-dessous, et je serai heureux de lire vos messages et d'interagir avec vous avec amour et respect.",
                add_module_title: 'Ajouter un nouveau module',
                edit_module_title: 'Modifier le module',
                module_name_label: 'Nom du Module',
                module_name_placeholder: 'Ex: Analyse 1',
                coeff_label: 'Coefficient',
                credits_label: 'Crédits',
                example_placeholder_2: 'Ex: 2',
                calc_module_gpa: 'Calculer la note du module',
                save: 'Enregistrer',
                cancel: 'Annuler',
                final_result: 'Résultat Final',
                semester_result_title: 'Résultat du Semestre',
                annual_result_title: 'Résultat Annuel',
                result_label: 'Résultat',
                credits_label_result: 'Crédits',
                remark_label: 'Mention',
                view_statement_title: 'Voir le Relevé de Notes',
                save_statement_title: 'Enregistrer comme Image',
                statement_title: 'Relevé de Notes',
                module_th: 'Module',
                credits_th: 'Crédits',
                coeff_th: 'Coeff.',
                grade_th: 'Moyenne',
                semester_gpa_summary: 'Moyenne Semestrielle',
                earned_credits_summary: 'Crédits Obtenus',
                remark_summary: 'Mention',
                alert_title: 'Avertissement',
                confirm: 'Confirmer',
                edit: 'Modifier',
                delete: 'Supprimer',
                confirm_delete_all_modules: 'Êtes-vous sûr de vouloir supprimer tous les modules enregistrés ?',
                confirm_change_calc_method: 'Changer la méthode de calcul supprimera tous les modules ajoutés. Voulez-vous continuer ?',
                confirm_change_credits_req: 'Changer les crédits requis effacera les données de la moyenne annuelle. Voulez-vous continuer ?',
                error_no_modules: 'Veuillez ajouter au moins un module.',
                error_invalid_annual_values: 'Veuillez saisir des valeurs valides pour tous les champs requis.',
                error_max_modules: 'Impossible d\'ajouter plus de 15 modules.',
                error_fill_all_fields: 'Veuillez remplir tous les champs requis.',
                error_grade_invalid: 'Au moins une note valide (entre 0 et 20) doit être activée et saisie.',
                error_feedback_empty: 'Veuillez d\'abord écrire votre suggestion.',
                feedback_sent_success: "Merci d'avoir soumis votre suggestion. Nous la prendrons en considération.",
                feedback_sent_error: 'Oups! Un problème est survenu lors de l\'envoi de votre formulaire. Veuillez réessayer.',
                error_offline: "Aucune connexion Internet détectée. Veuillez vérifier votre connexion et réessayer.",
                ok_btn: 'OK',
                success_title: 'Succès',
                remark_excellent: 'Excellent',
                remark_very_good: 'Très Bien',
                remark_good: 'Bien',
                remark_fairly_good: 'Assez Bien',
                remark_pass: 'Passable',
                remark_resit: 'Rattrapage',
                remark_poor: 'Faible',
                status_pass: 'Admis',
                status_debt: 'Admis avec Dettes',
                status_fail: 'Ajourné'
            }
        };

        // --- State Management ---
        let state = {
            language: 'ar',
            theme: 'auto',
            examWeight: 0.6,
            requiredCreditsForDebt: 30,
            saveSettings: true,
            modules: [],
            lastResult: {},
        };
        
        let confirmCallback = null;

        const saveState = () => {
            if (state.saveSettings) {
                const modulesData = [];
                getAll('.module-item').forEach(item => {
                    modulesData.push(JSON.parse(JSON.stringify(item.dataset)));
                });
                state.modules = modulesData;

                localStorage.setItem('gpa_calc_state', JSON.stringify({
                    theme: state.theme,
                    language: state.language,
                    examWeight: state.examWeight,
                    requiredCreditsForDebt: state.requiredCreditsForDebt,
                    modules: state.modules
                }));
            }
        };

        const loadState = () => {
            state.saveSettings = (localStorage.getItem('gpa_calc_save_pref') ?? 'true') === 'true';
            if (state.saveSettings) {
                try {
                    const savedState = JSON.parse(localStorage.getItem('gpa_calc_state'));
                    if (savedState) {
                        state = { ...state, ...savedState };
                    }
                } catch(e) {
                    console.error("Error loading state from localStorage:", e);
                    localStorage.removeItem('gpa_calc_state');
                }
            }
        };

        // --- UI Updates ---
        const applyTheme = () => {
            const docElement = document.documentElement;
            if (state.theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                docElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            } else {
                docElement.setAttribute('data-theme', state.theme);
            }
        };
        
        const updateSaveToggleUI = () => get('#save-settings-toggle').classList.toggle('active', state.saveSettings);
        const updateThemeOptionsUI = () => getAll('.theme-option').forEach(opt => opt.classList.toggle('selected', opt.dataset.themeValue === state.theme));
        const updateCalcMethodUI = () => getAll('.calc-option').forEach(opt => opt.classList.toggle('selected', Math.abs(parseFloat(opt.dataset.value) - state.examWeight) < 0.01));
        const updateRequiredCreditsUI = () => getAll('.credit-option').forEach(opt => opt.classList.toggle('selected', parseInt(opt.dataset.value) === state.requiredCreditsForDebt));
        const updateLanguageOptionsUI = () => getAll('.lang-option').forEach(opt => opt.classList.toggle('selected', opt.dataset.langValue === state.language));
        
        const applyLanguage = () => {
            const lang = state.language;
            const dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;
            document.documentElement.dir = dir;

            getAll('[data-translate-key]').forEach(el => {
                const key = el.dataset.translateKey;
                if (translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });
            getAll('[data-translate-placeholder-key]').forEach(el => {
                const key = el.dataset.translatePlaceholderKey;
                 if (translations[lang][key]) {
                    el.placeholder = translations[lang][key];
                }
            });
             getAll('[data-translate-title-key]').forEach(el => {
                const key = el.dataset.translateTitleKey;
                 if (translations[lang][key]) {
                    el.title = translations[lang][key];
                }
            });
        };

        const showPage = (pageId) => {
            getAll('.page').forEach(page => page.classList.remove('active'));
            get(`#${pageId}`)?.classList.add('active');
        };

        const openModal = (modalId) => {
            const modal = get(`#${modalId}`);
            if(modal) {
                modal.classList.add('active');
                if(modalId === 'statement-modal') {
                    get('#statement-content-body').scrollTop = 0;
                }
            }
        };

        const closeModal = (modalId) => {
             const modal = get(`#${modalId}`);
            if(modal) {
                modal.classList.remove('active');
            }
        };
        
        const showConfirmationModal = (messageKey, onConfirm) => {
            get('#alert-modal-title').textContent = translations[state.language]['alert_title'];
            get('#alert-icon-container').innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--danger-color); font-size: 3rem;"></i>`;
            get('#alert-modal-text').textContent = translations[state.language][messageKey];
            get('#alert-modal-ok-btn').style.display = 'none';
            get('#confirm-modal-confirm-btn').style.display = 'inline-block';
            get('#confirm-modal-cancel-btn').style.display = 'inline-block';
            confirmCallback = onConfirm;
            openModal('alert-modal');
        };
        
        const showSuccessModal = (messageKey) => {
            const T = translations[state.language];
            get('#alert-modal-title').textContent = T.success_title;
            get('#alert-icon-container').innerHTML = `<svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>`;
            get('#alert-modal-text').textContent = T[messageKey];
            const okBtn = get('#alert-modal-ok-btn');
            okBtn.textContent = T.ok_btn;
            okBtn.style.backgroundColor = 'var(--success-color)';
            okBtn.style.color = 'white';
            okBtn.style.display = 'block';
            get('#confirm-modal-confirm-btn').style.display = 'none';
            get('#confirm-modal-cancel-btn').style.display = 'none';
            openModal('alert-modal');
        };

        const clearAnnualInputs = () => {
            get('#s1-avg').value = '';
            get('#s1-credits').value = '';
            get('#s2-avg').value = '';
            get('#s2-credits').value = '';
        };
        
        // --- Event Listeners Setup ---
        const setupEventListeners = () => {
            // Page Navigation
            get('#main-page-settings-btn').addEventListener('click', () => showPage('settings-page'));
            getAll('.btn-back').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target)));
            getAll('.choice-card').forEach(card => card.addEventListener('click', () => showPage(card.dataset.target)));
            
            // Modals
            get('#contact-setting').addEventListener('click', () => openModal('contact-modal'));
            getAll('.btn-close-modal').forEach(btn => {
                btn.addEventListener('click', () => closeModal(btn.dataset.modal))
            });
            
            // Alert/Confirmation Modal
            get('#alert-modal-ok-btn').addEventListener('click', () => closeModal('alert-modal'));
            get('#confirm-modal-cancel-btn').addEventListener('click', () => {
                closeModal('alert-modal');
                confirmCallback = null;
            });
            get('#confirm-modal-confirm-btn').addEventListener('click', () => {
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                }
                closeModal('alert-modal');
                confirmCallback = null;
            });
            
            // Settings Accordions
            getAll('.setting-item[data-setting]').forEach(item => {
                item.querySelector('.setting-item-header').addEventListener('click', (e) => {
                    if (e.target.closest('.setting-content')) return;
                    item.classList.toggle('open');
                });
            });

            // Settings Options
            getAll('.theme-option').forEach(option => {
                option.addEventListener('click', () => {
                    state.theme = option.dataset.themeValue;
                    applyTheme();
                    updateThemeOptionsUI();
                    saveState();
                });
            });
            
            getAll('.calc-option').forEach(option => {
                option.addEventListener('click', () => {
                    const newWeight = parseFloat(option.dataset.value);
                    if (Math.abs(newWeight - state.examWeight) > 0.01 && getAll('.module-item').length > 0) {
                        showConfirmationModal('confirm_change_calc_method', () => {
                            state.examWeight = newWeight;
                            updateCalcMethodUI();
                            clearModules(true);
                            saveState();
                        });
                    } else {
                        state.examWeight = newWeight;
                        updateCalcMethodUI();
                        saveState();
                    }
                });
            });
            
            getAll('.credit-option').forEach(option => {
                option.addEventListener('click', () => {
                    const newCredits = parseInt(option.dataset.value);
                    if (newCredits === state.requiredCreditsForDebt) return;

                    const s1_avg = get('#s1-avg').value.trim();
                    const s2_avg = get('#s2-avg').value.trim();
                    const annualInputsFilled = s1_avg !== '' || s2_avg !== '';
                    
                    const changeCredits = () => {
                       state.requiredCreditsForDebt = newCredits;
                       updateRequiredCreditsUI();
                       saveState();
                    };

                    if (annualInputsFilled) {
                        showConfirmationModal('confirm_change_credits_req', () => {
                            clearAnnualInputs();
                            changeCredits();
                        });
                    } else {
                        changeCredits();
                    }
                });
            });
            
            getAll('.lang-option').forEach(option => {
                option.addEventListener('click', () => {
                    state.language = option.dataset.langValue;
                    applyLanguage();
                    updateLanguageOptionsUI();
                    saveState();
                });
            });

            get('#save-settings-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                state.saveSettings = !state.saveSettings;
                updateSaveToggleUI();
                if (state.saveSettings) {
                    saveState(); 
                } else {
                    localStorage.removeItem('gpa_calc_state');
                }
                localStorage.setItem('gpa_calc_save_pref', state.saveSettings);
            });

            // Feedback Form
            get('#feedback-form').addEventListener('submit', function(event) {
                event.preventDefault();
                const form = event.target;
                const data = new FormData(form);
                const T = translations[state.language];
                const submitBtn = form.querySelector('.btn-send');

                if (data.get('message').trim() === '') {
                    showConfirmationModal('error_feedback_empty', () => {});
                    return;
                }
                
                if(!navigator.onLine) {
                    return showConfirmationModal("error_offline", () => {});
                }

                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    if (response.ok) {
                       showSuccessModal('feedback_sent_success');
                        form.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert(T.feedback_sent_error);
                            }
                        })
                    }
                }).catch(error => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    alert(T.feedback_sent_error);
                });
            });
            
            // Result and Statement Actions
            get('#show-statement-btn').addEventListener('click', () => generateAndShowStatement());
            
            get('#save-statement-btn').addEventListener('click', () => {
                const statementModal = get('#statement-modal');
                if (!statementModal.classList.contains('active')) return;
                
                const statementElement = get('#statement-content');
                if (!statementElement) return;

                const title = 'Statement_of_Marks';
                
                const buttons = statementElement.querySelectorAll('.action-btn, .btn-close-modal');
                buttons.forEach(btn => btn.style.visibility = 'hidden');

                const watermarkLight = statementElement.querySelector('#watermark-light');
                const watermarkDark = statementElement.querySelector('#watermark-dark');
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if(watermarkLight) watermarkLight.style.display = currentTheme === 'light' ? 'block' : 'none';
                if(watermarkDark) watermarkDark.style.display = currentTheme === 'dark' ? 'block' : 'none';

                html2canvas(statementElement, {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim(),
                    useCORS: true,
                    scale: 2.5,
                    onclone: (clonedDoc) => {
                        const clonedWatermarkLight = clonedDoc.querySelector('#watermark-light');
                        const clonedWatermarkDark = clonedDoc.querySelector('#watermark-dark');
                        if(clonedWatermarkLight) clonedWatermarkLight.style.display = currentTheme === 'light' ? 'block' : 'none';
                        if(clonedWatermarkDark) clonedWatermarkDark.style.display = currentTheme === 'dark' ? 'block' : 'none';
                    }
                }).then(canvas => {
                    buttons.forEach(btn => btn.style.visibility = 'visible');
                    if(watermarkLight) watermarkLight.style.display = 'none';
                    if(watermarkDark) watermarkDark.style.display = 'none';
                    
                    const link = document.createElement('a');
                    link.download = `${title}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(err => {
                    console.error("Oops, something went wrong!", err);
                    buttons.forEach(btn => btn.style.visibility = 'visible');
                    if(watermarkLight) watermarkLight.style.display = 'none';
                    if(watermarkDark) watermarkDark.style.display = 'none';
                });
            });

            // Input Sanitization
            const enforceMaxInt = (el) => {
                const max = parseInt(el.max);
                let value = el.value.replace(/[^0-9]/g, '');
                if (parseInt(value) > max) {
                    value = max;
                }
                el.value = value;
            };
            getAll('input[type="number"]').forEach(input => input.addEventListener('input', () => enforceMaxInt(input)));

            const formatGradeInput = (e) => {
                let input = e.target;
                let value = input.value;
                
                let sanitizedValue = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.').replace(/(\..*)\./g, '$1');

                if (parseFloat(sanitizedValue) > 20) {
                    sanitizedValue = '20.00';
                }
                
                let parts = sanitizedValue.split('.');
                if (parts[1] && parts[1].length > 2) {
                    sanitizedValue = parts[0] + '.' + parts[1].substring(0, 2);
                }

                if(input.value !== sanitizedValue) {
                    input.value = sanitizedValue;
                }
            };
            getAll('input[data-is-grade-input="true"]').forEach(input => {
                input.addEventListener('input', formatGradeInput);
            });


            // Show Result Modal Logic
            const showResultModal = (data) => {
                state.lastResult = data;
                const T = translations[state.language];
                get('#result-modal-title').textContent = T[data.titleKey] || data.titleKey;
                const body = get('#result-modal-body');
                body.innerHTML = '';
                get('#show-statement-btn').style.display = 'none';

                if (data.errorKey) {
                    body.innerHTML = `<p style="color:var(--danger-color); font-weight:500;">${T[data.errorKey]}</p>`;
                } else if (data.isAnnual) {
                    const avgColor = data.average >= 10 ? 'var(--success-color)' : 'var(--danger-color)';
                    body.innerHTML = `<div class="result-item"><span class="result-label">${T.annual_gpa_title}:</span><span class="result-value" style="color: ${avgColor};">${data.average.toFixed(2)}</span></div><div class="result-item"><span class="result-label">${T.credits_label_result}:</span><span class="result-value">${data.credits} / 60</span></div>`;
                    if (data.status) body.innerHTML += `<div class="final-status ${data.status.class}">${T[data.status.textKey]}</div>`;
                } else { 
                    const averageColor = data.average >= 10 ? 'var(--success-color)' : 'var(--danger-color)';
                    body.innerHTML = `<div class="result-item"><span class="result-label">${T.result_label}:</span><span class="result-value" style="color: ${averageColor};">${data.average.toFixed(2)}</span></div><div class="result-item"><span class="result-label">${T.credits_label_result}:</span><span class="result-value">${data.credits} / 30</span></div><div class="result-item"><span class="result-label">${T.remark_label}:</span><span class="result-value">${T[data.remarkKey]}</span></div>`;
                    get('#show-statement-btn').style.display = 'block';
                }
                openModal('result-modal');
            };
            
            const generateAndShowStatement = () => {
                const T = translations[state.language];
                const listContainer = get('#statement-modules-list');
                const summaryContainer = get('#statement-summary');
                listContainer.innerHTML = '';
                summaryContainer.innerHTML = '';

                const modules = getAll('.module-item');
                modules.forEach(item => {
                    const { name, grade, coeff, credits } = item.dataset;
                    const row = document.createElement('div');
                    row.className = 'statement-row';
                    const gradeColor = parseFloat(grade) >= 10 ? 'var(--success-color)' : 'var(--danger-color)';
                    row.innerHTML = `<span>${name}</span><span>${credits}</span><span>${coeff}</span><span style="color: ${gradeColor}; font-weight: 700;">${parseFloat(grade).toFixed(2)}</span>`;
                    listContainer.appendChild(row);
                });
                
                const { average, credits, remarkKey } = state.lastResult;
                const avgColor = average >= 10 ? 'var(--success-color)' : 'var(--danger-color)';
                summaryContainer.innerHTML = `<div class="summary-item"><strong>${T.semester_gpa_summary}:</strong><span class="value" style="color: ${avgColor}">${average.toFixed(2)}</span></div><div class="summary-item"><strong>${T.earned_credits_summary}:</strong><span class="value">${credits} / 30</span></div><div class="summary-item"><strong>${T.remark_summary}:</strong><span class="value">${T[remarkKey]}</span></div>`;

                openModal('statement-modal');
            };

            // --- Module Management ---
            const moduleModal = get('#module-modal');
            get('#add-module-btn').addEventListener('click', () => {
                if(getAll('.module-item').length >= 15) {
                    showResultModal({titleKey: 'alert_title', errorKey: 'error_max_modules'});
                    return;
                }
                get('#modal-title').textContent = translations[state.language].add_module_title;
                moduleModal.dataset.mode = 'add';
                moduleModal.dataset.editId = '';
                resetModalForm();
                openModal('module-modal');
            });
            
            get('#reset-modules-btn').addEventListener('click', () => {
                const btn = get('#reset-modules-btn');
                if (getAll('.module-item').length > 0) {
                    showConfirmationModal('confirm_delete_all_modules', clearModules);
                } else {
                    btn.classList.add('shake');
                    setTimeout(() => btn.classList.remove('shake'), 500);
                }
            });
            
            get('#reset-annual-btn').addEventListener('click', () => {
                const btn = get('#reset-annual-btn');
                const s1_avg = get('#s1-avg').value.trim();
                const s2_avg = get('#s2-avg').value.trim();
                 const s1_credits = get('#s1-credits').value.trim();
                const s2_credits = get('#s2-credits').value.trim();
                if (s1_avg !== '' || s2_avg !== '' || s1_credits !== '' || s2_credits !== '') {
                    showConfirmationModal('confirm_delete_all_modules', clearAnnualInputs);
                } else {
                    btn.classList.add('shake');
                    setTimeout(() => btn.classList.remove('shake'), 500);
                }
            });


            get('#cancel-module-btn').addEventListener('click', () => closeModal('module-modal'));

            const resetModalForm = () => {
                // Clear all input fields in the modal
                getAll('#module-modal input').forEach(i => { i.value = ''; });
                // Deactivate all grade input groups and their toggles
                getAll('#module-modal .grade-input-group').forEach(group => {
                    group.classList.remove('active');
                    const toggle = group.querySelector('.toggle-switch');
                    if (toggle) {
                        toggle.classList.remove('active');
                    }
                });
                // Hide any previous error messages
                get('#modal-error').style.display = 'none';
            };
            
            // Toggle logic for grade inputs
            getAll('#module-modal .toggle-switch').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const group = toggle.closest('.grade-input-group');
                    const isActive = group.classList.toggle('active');
                    toggle.classList.toggle('active', isActive);

                    const controlsInput = get(`#${toggle.dataset.controls}`);
                    if(isActive) {
                        controlsInput.focus();
                    }

                    // Mutual exclusivity logic for TD/TP
                    const isTd = toggle.dataset.controls === 'td-input';
                    const isTp = toggle.dataset.controls === 'tp-input';
                    
                    if (isActive && isTd) {
                        const tpGroup = get('[data-controls="tp-input"]').closest('.grade-input-group');
                        tpGroup.classList.remove('active');
                        tpGroup.querySelector('.toggle-switch').classList.remove('active');
                    }
                    if (isActive && isTp) {
                        const tdGroup = get('[data-controls="td-input"]').closest('.grade-input-group');
                        tdGroup.classList.remove('active');
                        tdGroup.querySelector('.toggle-switch').classList.remove('active');
                    }
                });
            });
            
            // Save logic for module
            get('#save-module-btn').addEventListener('click', () => {
                const T = translations[state.language];
                const name = get('#modal-module-name').value.trim();
                const coeff = get('#modal-module-coeff').value.trim();
                const credits = get('#modal-module-credits').value.trim();
                const errorEl = get('#modal-error');
                const showError = (msgKey) => { errorEl.textContent = T[msgKey]; errorEl.style.display = 'block'; };
                
                if (!name || !coeff || !credits) return showError('error_fill_all_fields');

                const getVal = (input) => parseFloat(input.value.replace(',', '.'));
                const td = getVal(get('#td-input')), tp = getVal(get('#tp-input')), exam = getVal(get('#exam-input'));
                const valid = (val) => !isNaN(val) && val >= 0 && val <= 20;

                const tdActive = get('[data-controls="td-input"]').closest('.grade-input-group').classList.contains('active') && valid(td);
                const tpActive = get('[data-controls="tp-input"]').closest('.grade-input-group').classList.contains('active') && valid(tp);
                const examActive = get('[data-controls="exam-input"]').closest('.grade-input-group').classList.contains('active') && valid(exam);

                if (!tdActive && !tpActive && !examActive) return showError('error_grade_invalid');

                let finalGrade = 0;
                const td_tp_weight = 1 - state.examWeight;
                if (examActive && (tdActive || tpActive)) {
                    const continuousGrade = tdActive ? td : tp;
                    finalGrade = (exam * state.examWeight) + (continuousGrade * td_tp_weight);
                } else if (examActive) finalGrade = exam;
                else if (tdActive) finalGrade = td;
                else if (tpActive) finalGrade = tp;

                const moduleData = { name, coeff, credits, grade: finalGrade.toFixed(2), id: moduleModal.dataset.editId || Date.now().toString() };
                if (moduleModal.dataset.mode === 'edit') {
                    const itemToEdit = get(`.module-item[data-id="${moduleData.id}"]`);
                    if (itemToEdit) updateModuleInList(itemToEdit, moduleData);
                } else { addModuleToList(moduleData); }
                saveState();
                closeModal('module-modal');
            });
            
            const addModuleToList = (data) => {
                const list = get('#modules-list');
                if (list.querySelector('p')) list.innerHTML = '';
                const item = document.createElement('div');
                item.className = 'module-item';
                list.appendChild(item);
                updateModuleInList(item, data);
            };

            const updateModuleInList = (item, data) => {
                const T = translations[state.language];
                Object.keys(data).forEach(key => item.dataset[key] = data[key]);
                item.innerHTML = `<button class="kebab-menu"><i class="fa-solid fa-ellipsis-v"></i></button><ul class="module-options-menu"><li class="edit-btn"><i class="fa-solid fa-pencil"></i> ${T.edit}</li><li class="delete-btn"><i class="fa-solid fa-trash"></i> ${T.delete}</li></ul><div class="module-info"><h4>${data.name}</h4><div class="module-details"><span><strong>${T.grade_th}:</strong> ${data.grade}</span><span><strong>${T.coeff_th}:</strong> ${data.coeff}</span><span><strong>${T.credits_th}:</strong> ${data.credits}</span></div></div>`;
                item.querySelector('.kebab-menu').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const menu = item.querySelector('.module-options-menu');
                    getAll('.module-options-menu').forEach(m => { if(m !== menu) m.style.display = 'none'; });
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                });
                item.querySelector('.delete-btn').addEventListener('click', () => {
                    item.remove();
                    if (get('#modules-list').childElementCount === 0) {
                        get('#modules-list').innerHTML = `<p style="color:var(--text-muted-color); text-align:center; padding: 2rem 0;" data-translate-key="no_modules_yet">${T.no_modules_yet}</p>`;
                    }
                    saveState();
                });
                item.querySelector('.edit-btn').addEventListener('click', () => {
                    get('#modal-title').textContent = T.edit_module_title;
                    moduleModal.dataset.mode = 'edit';
                    moduleModal.dataset.editId = item.dataset.id;
                    resetModalForm();
                    get('#modal-module-name').value = item.dataset.name;
                    get('#modal-module-coeff').value = item.dataset.coeff;
                    get('#modal-module-credits').value = item.dataset.credits;
                    openModal('module-modal');
                });
            };
            
            const clearModules = (silent = false) => {
                 get('#modules-list').innerHTML = `<p style="color:var(--text-muted-color); text-align:center; padding: 2rem 0;" data-translate-key="no_modules_yet">${translations[state.language].no_modules_yet}</p>`;
                  if (!silent) saveState();
            }

            document.body.addEventListener('click', () => getAll('.module-options-menu').forEach(m => m.style.display = 'none'));

            // --- Calculation Logic ---
            const getRemarkKey = (grade) => {
                if (grade >= 18) return 'remark_excellent'; if (grade >= 16) return 'remark_very_good';
                if (grade >= 14) return 'remark_good'; if (grade >= 12) return 'remark_fairly_good';
                if (grade >= 10) return 'remark_pass'; if (grade >= 7) return 'remark_resit'; return 'remark_poor';
            };

            get('#show-semester-result-btn').addEventListener('click', () => {
                if(navigator.vibrate) navigator.vibrate(50);
                let totalPoints = 0, totalCoeffs = 0, earnedCredits = 0;
                const modules = getAll('.module-item');
                if (modules.length === 0) return showResultModal({ titleKey: 'alert_title', errorKey: 'error_no_modules' });
                
                modules.forEach(item => {
                    const grade = parseFloat(item.dataset.grade);
                    const coeff = parseFloat(item.dataset.coeff);
                    const credits = parseFloat(item.dataset.credits);
                    
                    totalPoints += grade * coeff;
                    totalCoeffs += coeff;

                    if (grade >= 10) {
                        earnedCredits += credits;
                    }
                });

                const average = totalCoeffs > 0 ? totalPoints / totalCoeffs : 0;
                const finalCredits = average >= 10 ? 30 : earnedCredits;

                showResultModal({ 
                    titleKey: 'semester_result_title', 
                    average: average, 
                    credits: finalCredits, 
                    remarkKey: getRemarkKey(average) 
                });
            });

            get('#show-annual-result-btn').addEventListener('click', () => {
                if(navigator.vibrate) navigator.vibrate(50);
                const s1_avg = parseFloat(get('#s1-avg').value.replace(',', '.'));
                let s1_credits = parseFloat(get('#s1-credits').value);
                const s2_avg = parseFloat(get('#s2-avg').value.replace(',', '.'));
                let s2_credits = parseFloat(get('#s2-credits').value);

                if (s1_avg >= 10) s1_credits = 30;
                if (s2_avg >= 10) s2_credits = 30;

                const valid = (...vals) => vals.every(v => !isNaN(v) && v >= 0);
                if (!valid(s1_avg, s1_credits, s2_avg, s2_credits)) {
                    return showResultModal({ titleKey: 'alert_title', errorKey: 'error_invalid_annual_values' });
                }
                
                const annual_avg = (s1_avg + s2_avg) / 2;
                let total_credits = s1_credits + s2_credits;
            
                let status;
                if (annual_avg >= 10 || total_credits >= 60) {
                    status = { textKey: 'status_pass', class: 'success' };
                    total_credits = 60;
                } else if (total_credits >= state.requiredCreditsForDebt) {
                    status = { textKey: 'status_debt', class: 'debt' };
                } else {
                    status = { textKey: 'status_fail', class: 'danger' };
                }
                
                showResultModal({ isAnnual: true, titleKey: 'annual_result_title', average: annual_avg, credits: total_credits, status: status });
            });
        };
        
        // --- Initialization ---
        const init = () => {
            loadState();
            applyTheme();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
            applyLanguage();
            updateSaveToggleUI();
            updateThemeOptionsUI();
            updateCalcMethodUI();
            updateRequiredCreditsUI();
            updateLanguageOptionsUI();
            if (state.modules && state.modules.length > 0) {
                const list = get('#modules-list');
                list.innerHTML = '';
                state.modules.forEach(moduleData => addModuleToList(moduleData));
            }
            setupEventListeners();
            showPage('main-page');
        };

        // Start the application logic
        init();
    }

    // Load components first, then initialize the app
    loadComponents();
});
