/**
 * Iron Family Cinema Production - Collaboration & Inquiry Application
 * Company: شركة سينما الأسرة الحديدية (Iron Family Cinema Production)
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

  const STORAGE_KEY = 'iron_family_cinema_inquiries_v1';
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
    const len = detailsInput.value.length;
    charCounter.textContent = `${len} / 1500`;
    if (len >= 1400) {
      charCounter.style.color = 'var(--error-color)';
    } else {
      charCounter.style.color = 'var(--text-light)';
    }
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
      const raw = localStorage.getItem(STORAGE_KEY);
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
`🎬 *طلب تعاون مشترك - سينما الأسرة الحديدية*
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
    charCounter.textContent = '0 / 1500';
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
    a.download = `IronFamily_Inquiries_${new Date().toISOString().slice(0, 10)}.json`;
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
    a.download = `IronFamily_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
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

  // ==========================================
  // 13. Hollywood-Grade 3D Premiere Night Canvas & Parallax Engine
  // (Multi-Depth Foreground Bokeh, Golden Dust, 35mm Film Strips & 3D Stage Parallax)
  // ==========================================
  function initPremiereAtmosphereCanvas() {
    const canvas = document.getElementById('cinemaAtmosphereCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // DOM Elements for 3D Parallax
    const curtainGroupLeft = document.getElementById('curtainGroupLeft');
    const curtainGroupRight = document.getElementById('curtainGroupRight');
    const curtainPelmet = document.getElementById('curtainPelmet');
    const godRayLeft = document.getElementById('godRayLeft');
    const godRayRight = document.getElementById('godRayRight');
    const cinemaStageFloor = document.getElementById('cinemaStageFloor');
    const projectorRig = document.getElementById('projectorRig');
    const projectorBeam = document.getElementById('projectorBeam');
    const propReelLeft = document.getElementById('propReelLeft');
    const propStripLeft = document.getElementById('propStripLeft');
    const propClapperRight = document.getElementById('propClapperRight');
    const propStripRight = document.getElementById('propStripRight');
    const redCarpetAisle = document.getElementById('redCarpetAisle');

    let width = 0;
    let height = 0;
    let animId = null;
    let isTabVisible = true;

    // Parallax Interpolation Variables
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      targetParallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          targetParallaxX = Math.max(-1, Math.min(1, e.gamma / 25));
          targetParallaxY = Math.max(-1, Math.min(1, (e.beta - 40) / 25));
        }
      }, { passive: true });
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    });

    const isMobile = window.innerWidth < 768;

    // Layer 1: Foreground Out-of-Focus Cinematic Bokeh Orbs (Camera Lens Depth)
    const bokehCount = isMobile ? 6 : 12;
    const foregroundBokeh = [];
    for (let i = 0; i < bokehCount; i++) {
      foregroundBokeh.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 14 + Math.random() * 26, // Large out-of-focus radius
        speedY: 0.15 + Math.random() * 0.35,
        speedX: 0.1 + Math.random() * 0.25,
        angle: Math.random() * Math.PI * 2,
        baseAlpha: 0.05 + Math.random() * 0.12,
        alphaPulse: Math.random() * Math.PI,
        colorType: Math.random() > 0.5 ? 'gold' : 'amber'
      });
    }

    // Layer 2: Midground Golden Sparkles & Rising Dust Motes
    const dustCount = isMobile ? 22 : 44;
    const midgroundDust = [];
    for (let i = 0; i < dustCount; i++) {
      midgroundDust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.2 + Math.random() * 3.2,
        speedY: 0.3 + Math.random() * 0.7,
        speedX: 0.15 + Math.random() * 0.35,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: 0.01 + Math.random() * 0.025,
        baseAlpha: 0.2 + Math.random() * 0.65,
        alphaPulse: Math.random() * Math.PI,
        colorType: Math.random() > 0.35 ? 'gold' : 'white'
      });
    }

    // Layer 3: Drifting 35mm Film Strip Silhouettes in Deep Background Space
    const filmStrips = [
      {
        x: width * 0.12,
        y: height * 0.25,
        vx: 0.16,
        vy: -0.1,
        rot: -0.22,
        vrot: 0.00035,
        w: 52,
        len: 260,
        alpha: 0.08
      },
      {
        x: width * 0.84,
        y: height * 0.62,
        vx: -0.14,
        vy: -0.15,
        rot: 0.16,
        vrot: -0.0003,
        w: 56,
        len: 280,
        alpha: 0.09
      },
      {
        x: width * 0.52,
        y: height * 0.85,
        vx: 0.12,
        vy: -0.18,
        rot: 0.32,
        vrot: 0.00045,
        w: 48,
        len: 240,
        alpha: 0.06
      }
    ];

    function drawFilmStrip(strip) {
      ctx.save();
      ctx.translate(strip.x, strip.y);
      ctx.rotate(strip.rot);
      ctx.globalAlpha = strip.alpha;

      const w = strip.w;
      const len = strip.len;
      const sprokH = 7;
      const sprokW = 5;
      const sprokMargin = 4;
      const step = 14;

      // Outer Film Body
      ctx.fillStyle = '#0D0D14';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.rect(-w / 2, -len / 2, w, len);
      ctx.fill();
      ctx.stroke();

      // Film Sprocket Perforation Holes (Left & Right margins)
      ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
      for (let y = -len / 2 + 6; y < len / 2 - 6; y += step) {
        ctx.fillRect(-w / 2 + sprokMargin, y, sprokW, sprokH);
        ctx.fillRect(w / 2 - sprokMargin - sprokW, y, sprokW, sprokH);
      }

      // Film Inner Picture Frames
      const frameW = w - (sprokMargin * 2 + sprokW * 2 + 8);
      const frameH = 55;
      const frameStep = 64;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1;

      for (let y = -len / 2 + 10; y < len / 2 - frameH; y += frameStep) {
        ctx.strokeRect(-frameW / 2, y, frameW, frameH);
        ctx.beginPath();
        ctx.moveTo(-frameW / 2 + 4, y + 4);
        ctx.lineTo(-frameW / 2 + 12, y + 4);
        ctx.stroke();
      }

      ctx.restore();
    }

    let lastTime = performance.now();

    function loop(time) {
      if (!isTabVisible) {
        animId = null;
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth Parallax Interpolation (Lerp)
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.055;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.055;

      // Apply 3D Shift to Stage Elements with Sub-pixel Precision
      if (curtainGroupLeft) {
        curtainGroupLeft.style.transform = `translate3d(${currentParallaxX * -14}px, ${currentParallaxY * -6}px, 0)`;
      }
      if (curtainGroupRight) {
        curtainGroupRight.style.transform = `translate3d(${currentParallaxX * -14}px, ${currentParallaxY * -6}px, 0)`;
      }
      if (curtainPelmet) {
        curtainPelmet.style.transform = `translate3d(0, ${currentParallaxY * -8}px, 0)`;
      }
      if (godRayLeft) {
        godRayLeft.style.transform = `rotate(${-16 + currentParallaxX * 6}deg)`;
      }
      if (godRayRight) {
        godRayRight.style.transform = `rotate(${16 + currentParallaxX * 6}deg)`;
      }
      if (cinemaStageFloor) {
        cinemaStageFloor.style.transform = `translate3d(0, ${currentParallaxY * 5}px, 0)`;
      }
      if (projectorRig) {
        projectorRig.style.transform = `translateX(calc(-50% + ${currentParallaxX * 6}px))`;
      }
      if (projectorBeam) {
        projectorBeam.style.transform = `translateX(-50%) rotate(${currentParallaxX * 3.5}deg)`;
      }
      if (propReelLeft) {
        propReelLeft.style.transform = `translate3d(${currentParallaxX * -18}px, ${currentParallaxY * -10}px, 0)`;
      }
      if (propStripLeft) {
        propStripLeft.style.transform = `translate3d(${currentParallaxX * -22}px, ${currentParallaxY * -12}px, 0)`;
      }
      if (propClapperRight) {
        propClapperRight.style.transform = `translate3d(${currentParallaxX * -18}px, ${currentParallaxY * -10}px, 0)`;
      }
      if (propStripRight) {
        propStripRight.style.transform = `translate3d(${currentParallaxX * -22}px, ${currentParallaxY * -12}px, 0)`;
      }
      if (redCarpetAisle) {
        redCarpetAisle.style.transform = `translateX(calc(-50% + ${currentParallaxX * 8}px)) translate3d(0, ${currentParallaxY * 4}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Render Drifting 35mm Film Strip Silhouettes in Deep Space
      filmStrips.forEach(strip => {
        strip.x += (strip.vx + currentParallaxX * 0.2) * (dt * 60);
        strip.y += (strip.vy + currentParallaxY * 0.15) * (dt * 60);
        strip.rot += strip.vrot * (dt * 60);

        if (strip.y < -strip.len) strip.y = height + strip.len;
        if (strip.y > height + strip.len) strip.y = -strip.len;
        if (strip.x < -strip.len) strip.x = width + strip.len;
        if (strip.x > width + strip.len) strip.x = -strip.len;

        drawFilmStrip(strip);
      });

      // 2. Render Midground Golden Sparkles & Rising Dust Motes
      midgroundDust.forEach(p => {
        p.y -= p.speedY * (dt * 60);
        p.angle += p.angleSpeed * (dt * 60);
        p.x += (Math.sin(p.angle) * p.speedX + currentParallaxX * 0.3) * (dt * 60);
        p.alphaPulse += 0.025 * (dt * 60);

        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        const currentAlpha = Math.max(0.08, p.baseAlpha + Math.sin(p.alphaPulse) * 0.25);

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        if (p.r > 2.2) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
          grad.addColorStop(0, 'rgba(255, 245, 195, 0.95)');
          grad.addColorStop(0.4, 'rgba(212, 175, 55, 0.65)');
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.colorType === 'gold' ? '#FFF2A3' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 3. Render Foreground Large Lens Bokeh Orbs (Cinematic Out-of-Focus Depth)
      foregroundBokeh.forEach(b => {
        b.y -= b.speedY * (dt * 60);
        b.angle += 0.008 * (dt * 60);
        b.x += (Math.cos(b.angle) * b.speedX + currentParallaxX * 0.7) * (dt * 60);
        b.alphaPulse += 0.015 * (dt * 60);

        if (b.y < -b.r * 2) {
          b.y = height + b.r * 2;
          b.x = Math.random() * width;
        }
        if (b.x < -b.r * 2) b.x = width + b.r * 2;
        if (b.x > width + b.r * 2) b.x = -b.r * 2;

        const currentAlpha = Math.max(0.03, b.baseAlpha + Math.sin(b.alphaPulse) * 0.05);

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        if (b.colorType === 'gold') {
          grad.addColorStop(0, 'rgba(255, 240, 185, 0.55)');
          grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.25)');
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        } else {
          grad.addColorStop(0, 'rgba(255, 190, 140, 0.5)');
          grad.addColorStop(0.5, 'rgba(155, 17, 30, 0.22)');
          grad.addColorStop(1, 'rgba(155, 17, 30, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
  }

  // Initialize Premiere Atmosphere & Controls
  initPremiereAtmosphereCanvas();
  updateInquiryBadge();
  updateCountryCodeSelection('EG');
});
