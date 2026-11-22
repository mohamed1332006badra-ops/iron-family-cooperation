/**
 * Iron Cinema Company - Collaboration & Inquiry Application
 * Company: شركة السينما الحديدية (Iron Cinema Company)
 * Official WhatsApp Target: https://wa.me/201125566003
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Data Dictionaries & Country Mapping
  // ==========================================
  const countryData = {
    'EG': { nameAr: 'جمهورية مصر العربية', nameEn: 'Egypt', code: '+20', flag: '🇪🇬', minLen: 9, maxLen: 11, placeholder: '1XXXXXXXXX' },
    'AE': { nameAr: 'الإمارات العربية المتحدة', nameEn: 'UAE', code: '+971', flag: '🇦🇪', minLen: 8, maxLen: 10, placeholder: '5XXXXXXXX' },
    'SA': { nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', code: '+966', flag: '🇸🇦', minLen: 8, maxLen: 10, placeholder: '5XXXXXXXX' },
    'KW': { nameAr: 'دولة الكويت', nameEn: 'Kuwait', code: '+965', flag: '🇰🇼', minLen: 7, maxLen: 9, placeholder: 'XXXXXXXX' },
    'QA': { nameAr: 'دولة قطر', nameEn: 'Qatar', code: '+974', flag: '🇶🇦', minLen: 7, maxLen: 9, placeholder: 'XXXXXXXX' },
    'BH': { nameAr: 'مملكة البحرين', nameEn: 'Bahrain', code: '+973', flag: '🇧🇭', minLen: 7, maxLen: 9, placeholder: 'XXXXXXXX' },
    'OM': { nameAr: 'سلطنة عُمان', nameEn: 'Oman', code: '+968', flag: '🇴🇲', minLen: 7, maxLen: 9, placeholder: 'XXXXXXXX' },
    'JO': { nameAr: 'المملكة الأردنية الهاشمية', nameEn: 'Jordan', code: '+962', flag: '🇯🇴', minLen: 8, maxLen: 10, placeholder: '7XXXXXXXX' },
    'LY': { nameAr: 'دولة ليبيا', nameEn: 'Libya', code: '+218', flag: '🇱🇾', minLen: 8, maxLen: 10, placeholder: '9XXXXXXXX' },
    'IQ': { nameAr: 'جمهورية العراق', nameEn: 'Iraq', code: '+964', flag: '🇮🇶', minLen: 8, maxLen: 11, placeholder: '7XXXXXXXXX' },
    'LB': { nameAr: 'الجمهورية اللبنانية', nameEn: 'Lebanon', code: '+961', flag: '🇱🇧', minLen: 7, maxLen: 9, placeholder: 'XXXXXXXX' },
    'MA': { nameAr: 'المملكة المغربية', nameEn: 'Morocco', code: '+212', flag: '🇲🇦', minLen: 8, maxLen: 10, placeholder: '6XXXXXXXX' },
    'DZ': { nameAr: 'الجمهورية الجزائرية', nameEn: 'Algeria', code: '+213', flag: '🇩🇿', minLen: 8, maxLen: 10, placeholder: 'XXXXXXXXX' },
    'TN': { nameAr: 'الجمهورية التونسية', nameEn: 'Tunisia', code: '+216', flag: '🇹🇳', minLen: 7, maxLen: 9, placeholder: 'XXXXXXXX' },
    'US': { nameAr: 'الولايات المتحدة الأمريكية', nameEn: 'USA/CA', code: '+1', flag: '🇺🇸', minLen: 10, maxLen: 10, placeholder: 'XXXXXXXXXX' },
    'GB': { nameAr: 'المملكة المتحدة', nameEn: 'UK', code: '+44', flag: '🇬🇧', minLen: 9, maxLen: 11, placeholder: '7XXXXXXXXX' },
    'TR': { nameAr: 'الجمهورية التركية', nameEn: 'Turkey', code: '+90', flag: '🇹🇷', minLen: 9, maxLen: 11, placeholder: '5XXXXXXXXX' }
  };

  const STORAGE_KEY = 'iron_cinema_inquiries_v1';
  const LEGACY_STORAGE_KEY = 'iron_family_cinema_inquiries_v1';
  const OFFICIAL_WA_NUMBER = '201125566003';

  // ==========================================
  // 2. DOM Elements
  // ==========================================
  const form = document.getElementById('inquiryForm');
  const subjectInput = document.getElementById('subjectInput');
  const detailsInput = document.getElementById('detailsInput');
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const pageLinkInput = document.getElementById('pageLinkInput');
  const countryCodeSelect = document.getElementById('countryCodeSelect');
  const phoneInput = document.getElementById('phoneInput');
  const countrySelect = document.getElementById('countrySelect');
  const activeDialCodePrefix = document.getElementById('activeDialCodePrefix');
  const phoneHelperStrip = document.getElementById('phoneHelperStrip');
  const phoneHelperText = document.getElementById('phoneHelperText');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const topicChips = document.querySelectorAll('.topic-chip');

  // Confirmation Elements
  const confirmationOverlay = document.getElementById('confirmationOverlay');
  const confirmationSummary = document.getElementById('confirmationSummary');
  const directWaLink = document.getElementById('directWaLink');
  const countdownBar = document.getElementById('countdownBar');
  const countdownSeconds = document.getElementById('countdownSeconds');
  const dismissConfirmationBtn = document.getElementById('dismissConfirmationBtn');

  // History & Modal Elements
  const copyInviteBtn = document.getElementById('copyInviteBtn');
  const historyToggleBtn = document.getElementById('historyToggleBtn');
  const footerHistoryBtn = document.getElementById('footerHistoryBtn');
  const inquiriesModal = document.getElementById('inquiriesModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const inquiryCountBadge = document.getElementById('inquiryCountBadge');
  const inquiriesListContainer = document.getElementById('inquiriesListContainer');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const clearInquiriesBtn = document.getElementById('clearInquiriesBtn');
  const toastContainer = document.getElementById('toastContainer');

  let countdownInterval = null;

  // ==========================================
  // 3. Helper Functions & Toast Notifications
  // ==========================================
  function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }

  function stripLeadingZeros(phoneVal) {
    // Keep only digits
    let digits = phoneVal.replace(/\D/g, '');
    // Strip all leading zeros
    return digits.replace(/^0+/, '');
  }

  // ==========================================
  // 4. Two-Way Sync: Country Code <-> Country
  // ==========================================
  function updateCountryCodeSelection(countryIso) {
    const selectedData = countryData[countryIso];
    if (!selectedData) return;

    // Sync country code dropdown
    const targetOption = Array.from(countryCodeSelect.options).find(
      opt => opt.getAttribute('data-country') === countryIso
    );
    if (targetOption) {
      countryCodeSelect.value = targetOption.value;
      activeDialCodePrefix.textContent = targetOption.value;
    }

    // Update phone placeholder based on country mask
    if (selectedData.placeholder) {
      phoneInput.placeholder = selectedData.placeholder;
    }
  }

  function updateCountrySelectFromCode(dialCode) {
    const selectedOption = countryCodeSelect.options[countryCodeSelect.selectedIndex];
    const countryIso = selectedOption.getAttribute('data-country');
    if (countryIso && countrySelect.value !== countryIso) {
      countrySelect.value = countryIso;
    }
    activeDialCodePrefix.textContent = dialCode;
    
    // Update phone placeholder
    const data = countryData[countryIso];
    if (data && data.placeholder) {
      phoneInput.placeholder = data.placeholder;
    }
  }

  // Event Listeners for 2-Way Sync
  countryCodeSelect.addEventListener('change', (e) => {
    updateCountrySelectFromCode(e.target.value);
    validateField('phone');
  });

  countrySelect.addEventListener('change', (e) => {
    updateCountryCodeSelection(e.target.value);
    validateField('phone');
  });

  // ==========================================
  // 5. Phone Input Sanitization & Auto-Strip
  // ==========================================
  phoneInput.addEventListener('input', () => {
    let rawVal = phoneInput.value;
    
    // Check if user started with 0 (e.g. 01125566003 or 0501234567)
    if (rawVal.startsWith('0')) {
      const stripped = stripLeadingZeros(rawVal);
      phoneInput.value = stripped;
      
      phoneHelperText.textContent = `تم إزالة الصفر الأول تلقائياً لتوافق الواتساب الدولي (${stripped})`;
      phoneHelperStrip.style.display = 'flex';
      
      // Auto hide helper after 4 seconds if untouched
      setTimeout(() => {
        phoneHelperStrip.style.display = 'none';
      }, 4000);
    } else {
      // Remove any non-numeric characters
      phoneInput.value = rawVal.replace(/\D/g, '');
      if (!rawVal.startsWith('0') && phoneHelperStrip.style.display !== 'none') {
        phoneHelperStrip.style.display = 'none';
      }
    }

    validateField('phone', false);
  });

  phoneInput.addEventListener('blur', () => {
    validateField('phone', true);
  });

  // ==========================================
  // 6. Character Counter for Details Textarea
  // ==========================================
  detailsInput.addEventListener('input', () => {
    validateField('details', false);
  });

  detailsInput.addEventListener('blur', () => {
    validateField('details', true);
  });

  // ==========================================
  // 7. Quick Topic Chips Handling
  // ==========================================
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      subjectInput.value = topic;
      
      // Toggle active states
      topicChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      validateField('subject');
      subjectInput.focus();
    });
  });

  subjectInput.addEventListener('input', () => {
    // Check if input matches any chip
    topicChips.forEach(c => {
      if (c.getAttribute('data-topic') === subjectInput.value.trim()) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    validateField('subject', false);
  });

  subjectInput.addEventListener('blur', () => {
    validateField('subject', true);
  });

  nameInput.addEventListener('input', () => validateField('name', false));
  nameInput.addEventListener('blur', () => validateField('name', true));

  emailInput.addEventListener('input', () => validateField('email', false));
  emailInput.addEventListener('blur', () => validateField('email', true));

  pageLinkInput.addEventListener('input', () => validateField('pageLink', false));
  pageLinkInput.addEventListener('blur', () => validateField('pageLink', true));

  // ==========================================
  // 8. Real-time Field Validation
  // ==========================================
  function setFieldState(fieldId, isValid, errorMessage = '') {
    const group = document.getElementById(`group-${fieldId}`);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (!group || !errorEl) return;

    if (isValid) {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      errorEl.textContent = '';
    } else {
      group.classList.remove('has-success');
      if (errorMessage) {
        group.classList.add('has-error');
        errorEl.textContent = errorMessage;
      } else {
        group.classList.remove('has-error');
        errorEl.textContent = '';
      }
    }
  }

  function validateField(fieldId, showErrors = true) {
    if (fieldId === 'subject') {
      const val = subjectInput.value.trim();
      if (!val) {
        if (showErrors) setFieldState('subject', false, 'يرجى كتابة موضوع الطلب أو اختيار أحد الاقتراحات • Please enter subject');
        return false;
      }
      if (val.length < 3) {
        if (showErrors) setFieldState('subject', false, 'الموضوع قصير جداً، يرجى كتابة 3 أحرف على الأقل • Min 3 chars');
        return false;
      }
      setFieldState('subject', true);
      return true;
    }

    if (fieldId === 'details') {
      const val = detailsInput.value.trim();
      if (!val) {
        if (showErrors) setFieldState('details', false, 'يرجى توضيح تفاصيل مشروعك أو فكرة التعاون • Please provide details');
        return false;
      }
      if (val.length < 10) {
        if (showErrors) setFieldState('details', false, 'يرجى كتابة تفاصيل أكثر وضوحاً (10 أحرف على الأقل) • Min 10 chars');
        return false;
      }
      setFieldState('details', true);
      return true;
    }

    if (fieldId === 'name') {
      const val = nameInput.value.trim();
      if (!val) {
        if (showErrors) setFieldState('name', false, 'يرجى كتابة اسمك أو اسم جهة العمل / الشركة • Please enter your name/company');
        return false;
      }
      if (val.length < 2) {
        if (showErrors) setFieldState('name', false, 'الاسم يجب أن يحتوي على حرفين على الأقل • Min 2 characters');
        return false;
      }
      setFieldState('name', true);
      return true;
    }

    if (fieldId === 'email') {
      const val = emailInput.value.trim();
      if (!val) {
        if (showErrors) setFieldState('email', false, 'يرجى إدخال البريد الإلكتروني • Please enter your email');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        if (showErrors) setFieldState('email', false, 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@domain.com) • Valid email required');
        return false;
      }
      setFieldState('email', true);
      return true;
    }

    if (fieldId === 'pageLink') {
      const val = pageLinkInput.value.trim();
      // Optional field; if provided, validate length
      if (val && val.length < 3) {
        if (showErrors) setFieldState('pageLink', false, 'الرابط قصير جداً، يرجى كتابة رابط أو حساب صحيح • Please enter valid link');
        return false;
      }
      setFieldState('pageLink', true);
      return true;
    }

    if (fieldId === 'phone') {
      const val = phoneInput.value.trim();
      const stripped = stripLeadingZeros(val);
      const selectedIso = countrySelect.value;
      const countryConf = countryData[selectedIso] || { minLen: 7, maxLen: 12 };

      if (!stripped) {
        if (showErrors) setFieldState('phone', false, 'يرجى إدخال رقم الهاتف أو الواتساب • Please enter phone number');
        return false;
      }
      if (stripped.length < countryConf.minLen || stripped.length > countryConf.maxLen) {
        if (showErrors) {
          setFieldState(
            'phone', 
            false, 
            `رقم الهاتف غير مكتمل لدولة ${countryConf.nameAr} (${countryConf.minLen}-${countryConf.maxLen} أرقام بدون أصفار البداية)`
          );
        }
        return false;
      }
      setFieldState('phone', true);
      return true;
    }

    return true;
  }

  function validateAll() {
    const isSubjectValid = validateField('subject', true);
    const isDetailsValid = validateField('details', true);
    const isNameValid = validateField('name', true);
    const isEmailValid = validateField('email', true);
    const isPageLinkValid = validateField('pageLink', true);
    const isPhoneValid = validateField('phone', true);

    return isSubjectValid && isDetailsValid && isNameValid && isEmailValid && isPageLinkValid && isPhoneValid;
  }

  // ==========================================
  // 9. LocalStorage Inquiries Backup Management
  // ==========================================
  function getStoredInquiries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return [];
    }
  }

  function saveInquiryToLocal(inquiry) {
    try {
      const existing = getStoredInquiries();
      existing.unshift(inquiry); // Newest first
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      updateInquiryBadge();
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  function updateInquiryBadge() {
    const count = getStoredInquiries().length;
    inquiryCountBadge.textContent = count;
  }

  function renderInquiriesList() {
    const list = getStoredInquiries();
    if (list.length === 0) {
      inquiriesListContainer.innerHTML = `
        <div class="empty-records-state">
          <div class="empty-icon">📂</div>
          <h4>لا توجد طلبات محفوظة حتى الآن</h4>
          <p>عند إرسال أي استفسار، سيتم حفظ نسخة احتياطية محلية هنا تلقائياً.</p>
        </div>
      `;
      return;
    }

    inquiriesListContainer.innerHTML = list.map((item, idx) => `
      <div class="inquiry-record-card">
        <div class="record-top">
          <span class="record-subject">#${list.length - idx} • ${escapeHtml(item.subject)}</span>
          <span class="record-date">${escapeHtml(item.formattedDate)}</span>
        </div>
        <div class="record-details">${escapeHtml(item.details)}</div>
        <div class="record-footer">
          <span>👤 ${escapeHtml(item.name)}</span>
          <span>📧 ${escapeHtml(item.email || 'غير مسجل')}</span>
          <span>🔗 ${escapeHtml(item.pageLink || 'لم يُذكر')}</span>
          <span>🌍 ${escapeHtml(item.countryName)}</span>
          <span dir="ltr">📱 ${escapeHtml(item.fullPhoneWithDial)}</span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 10. Form Submission & WhatsApp Routing
  // ==========================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) {
      showToast('يرجى تصحيح الأخطاء الموضحة باللون الأحمر قبل المتابعة • Please fix errors', 'error');
      // Scroll to first invalid field
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Set submit button loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // Gather and format data
    const subject = subjectInput.value.trim();
    const details = detailsInput.value.trim();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const pageLink = pageLinkInput.value.trim();
    const pageLinkDisplay = pageLink || 'لم يُذكر';
    const countryCode = countryCodeSelect.value; // e.g. +20
    const rawPhone = phoneInput.value.trim();
    const cleanPhone = stripLeadingZeros(rawPhone);
    const fullPhoneWithDial = `${countryCode} ${cleanPhone}`;
    const countryIso = countrySelect.value;
    const countryInfo = countryData[countryIso] || { nameAr: 'غير محدد', nameEn: 'Not specified' };
    const countryName = `${countryInfo.flag || ''} ${countryInfo.nameAr} • ${countryInfo.nameEn}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const inquiryRecord = {
      id: 'INQ_' + Date.now(),
      timestamp: now.toISOString(),
      formattedDate: formattedDate,
      subject: subject,
      details: details,
      name: name,
      email: email,
      pageLink: pageLinkDisplay,
      countryIso: countryIso,
      countryName: countryName,
      countryCode: countryCode,
      cleanPhone: cleanPhone,
      fullPhoneWithDial: fullPhoneWithDial
    };

    // 1. Save locally to localStorage
    saveInquiryToLocal(inquiryRecord);

    // 2. Format WhatsApp Message
    const waMessage = 
`🎬 *طلب تعاون مشترك - شركة السينما الحديدية*
━━━━━━━━━━━━━━━━━━━━
📌 *الموضوع / Subject:*
${subject}

👤 *الاسم / Name:*
${name}

📧 *البريد الإلكتروني / Email:*
${email}

🔗 *رابط الصفحة / Page Link:*
${pageLinkDisplay}

🌍 *الدولة / Country:*
${countryName} (${countryCode})

📱 *رقم الهاتف والواتساب / Phone:*
${fullPhoneWithDial}

📝 *تفاصيل التعاون / Details:*
${details}
━━━━━━━━━━━━━━━━━━━━
📅 *التاريخ:* ${formattedDate}
✨ تم الإرسال عبر البوابة الرسمية للتعاون المشترك`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodedMessage}`;

    // Update Direct WhatsApp Button
    directWaLink.href = waUrl;

    // Populate confirmation summary
    confirmationSummary.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">الموضوع:</span>
        <span class="summary-val" style="direction: rtl;">${escapeHtml(subject)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">الاسم:</span>
        <span class="summary-val" style="direction: rtl;">${escapeHtml(name)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">البريد الإلكتروني:</span>
        <span class="summary-val" style="direction: ltr;">${escapeHtml(email)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">رابط الصفحة:</span>
        <span class="summary-val" style="direction: ltr;">${escapeHtml(pageLinkDisplay)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">الدولة:</span>
        <span class="summary-val" style="direction: rtl;">${escapeHtml(countryName)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">رقم الهاتف:</span>
        <span class="summary-val">${escapeHtml(fullPhoneWithDial)}</span>
      </div>
    `;

    // 3. Show confirmation overlay & toast
    showToast('تم تسجيل وحفظ طلبكم بنجاح! جارٍ تحويلك للواتساب... • Request logged!', 'success');
    
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      showConfirmationModal(waUrl);
    }, 600);
  });

  // ==========================================
  // 11. Confirmation Modal & Auto-Redirect
  // ==========================================
  function showConfirmationModal(waUrl) {
    confirmationOverlay.classList.add('is-active');
    confirmationOverlay.setAttribute('aria-hidden', 'false');

    let secondsLeft = 3;
    countdownSeconds.textContent = secondsLeft;
    countdownBar.style.width = '100%';

    // Trigger bar transition
    setTimeout(() => {
      countdownBar.style.width = '0%';
    }, 50);

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft > 0) {
        countdownSeconds.textContent = secondsLeft;
      } else {
        clearInterval(countdownInterval);
        countdownSeconds.textContent = '0';
        // Auto open WhatsApp
        window.open(waUrl, '_blank');
      }
    }, 1000);
  }

  function hideConfirmationModal() {
    if (countdownInterval) clearInterval(countdownInterval);
    confirmationOverlay.classList.remove('is-active');
    confirmationOverlay.setAttribute('aria-hidden', 'true');
  }

  dismissConfirmationBtn.addEventListener('click', () => {
    hideConfirmationModal();
    form.reset();
    charCounter.textContent = 'مفتوح • Unlimited';
    activeDialCodePrefix.textContent = '+20';
    document.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-success', 'has-error');
    });
    topicChips.forEach(c => c.classList.remove('active'));
  });

  // ==========================================
  // 12. Local Inquiries Modal Controls
  // ==========================================
  function openInquiriesModal() {
    renderInquiriesList();
    inquiriesModal.classList.add('is-active');
    inquiriesModal.setAttribute('aria-hidden', 'false');
  }

  function closeInquiriesModal() {
    inquiriesModal.classList.remove('is-active');
    inquiriesModal.setAttribute('aria-hidden', 'true');
  }

  historyToggleBtn.addEventListener('click', openInquiriesModal);
  footerHistoryBtn.addEventListener('click', openInquiriesModal);
  modalCloseBtn.addEventListener('click', closeInquiriesModal);
  modalBackdrop.addEventListener('click', closeInquiriesModal);

  // Copy Invitation Message Button Handler
  if (copyInviteBtn) {
    copyInviteBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const inviteMsg = 
`https://iron-family-cooperation.vercel.app

طلب تعاون مشترك، وبعد إرسال الطلب سيتواصل فريقنا معكم.

شكرًا لكم! 🙌`;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(inviteMsg)
          .then(() => {
            showToast('✅ تم نسخ رسالة الدعوة بالرابط بنجاح!', 'success');
          })
          .catch(() => {
            fallbackCopyText(inviteMsg);
          });
      } else {
        fallbackCopyText(inviteMsg);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.fontSize = '16px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast('✅ تم نسخ رسالة الدعوة بالرابط بنجاح!', 'success');
      } else {
        showToast('يرجى نسخ الرابط يدوياً: https://iron-family-cooperation.vercel.app', 'info');
      }
    } catch (err) {
      showToast('يرجى نسخ الرابط يدوياً: https://iron-family-cooperation.vercel.app', 'info');
    }

    document.body.removeChild(textArea);
  }

  // Export JSON
  exportJsonBtn.addEventListener('click', () => {
    const data = getStoredInquiries();
    if (data.length === 0) {
      showToast('لا توجد بيانات لتصديرها حالياً', 'info');
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IronCinema_Inquiries_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف JSON بنجاح', 'success');
  });

  // Export CSV
  exportCsvBtn.addEventListener('click', () => {
    const data = getStoredInquiries();
    if (data.length === 0) {
      showToast('لا توجد بيانات لتصديرها حالياً', 'info');
      return;
    }
    const headers = ['ID', 'Date', 'Subject', 'Name', 'Email', 'PageLink', 'Country', 'Phone', 'Details'];
    const rows = data.map(item => [
      `"${item.id}"`,
      `"${item.formattedDate}"`,
      `"${(item.subject || '').replace(/"/g, '""')}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.pageLink || '').replace(/"/g, '""')}"`,
      `"${(item.countryName || '').replace(/"/g, '""')}"`,
      `"${item.fullPhoneWithDial}"`,
      `"${(item.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IronCinema_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف CSV بنجاح', 'success');
  });

  // Clear Inquiries
  clearInquiriesBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من مسح جميع الاستفسارات المحفوظة في هذا المتصفح؟')) {
      localStorage.removeItem(STORAGE_KEY);
      updateInquiryBadge();
      renderInquiriesList();
      showToast('تم مسح السجل المحلي بنجاح', 'info');
    }
  });

  // Initialize Controls
  updateInquiryBadge();
  updateCountryCodeSelection('EG');
});
