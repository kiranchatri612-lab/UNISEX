/* ==========================================================
   ÉCLAT HAUTE COIFFURE & LUXURY SPA
   Interactive Multi-Step Luxury Booking Drawer
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('bookingDrawer');
  const openBtns = document.querySelectorAll('.open-booking-btn');
  const closeBtn = document.getElementById('closeBookingBtn');
  const nextBtn = document.getElementById('bookingNextBtn');
  const prevBtn = document.getElementById('bookingPrevBtn');
  const submitBtn = document.getElementById('bookingSubmitBtn');

  if (!drawer) return;

  let currentStep = 1;
  const totalSteps = 4;
  let selectedServices = [];
  let totalPrice = 0;

  // Open Drawer
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // Pre-select service if passed in data attribute
      const preselected = btn.getAttribute('data-service');
      if (preselected) {
        const matchItem = document.querySelector(`.service-select-item[data-name="${preselected}"]`);
        if (matchItem && !matchItem.classList.contains('selected')) {
          matchItem.click();
        }
      }
    });
  });

  // Close Drawer
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Service Selection Logic
  const serviceItems = document.querySelectorAll('.service-select-item');
  const priceDisplay = document.getElementById('bookingTotalPrice');

  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
      const serviceName = item.getAttribute('data-name');
      const servicePrice = parseInt(item.getAttribute('data-price') || '0', 10);

      if (item.classList.contains('selected')) {
        selectedServices.push({ name: serviceName, price: servicePrice });
      } else {
        selectedServices = selectedServices.filter(s => s.name !== serviceName);
      }

      totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
      if (priceDisplay) {
        priceDisplay.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
      }
    });
  });

  // Step Navigation
  function updateStepView() {
    const steps = document.querySelectorAll('.booking-step');
    const indicators = document.querySelectorAll('.step-indicator');

    steps.forEach((step, idx) => {
      if (idx + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    indicators.forEach((ind, idx) => {
      if (idx + 1 <= currentStep) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });

    // Button Visibility
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1 && selectedServices.length === 0) {
        alert('Please select at least one service to proceed.');
        return;
      }
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepView();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }

  // Form Submission & WhatsApp Redirect
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('clientName')?.value || 'Valued Guest';
      const clientPhone = document.getElementById('clientPhone')?.value || '';
      const appointmentDate = document.getElementById('appointmentDate')?.value || 'Upcoming';
      const appointmentTime = document.getElementById('appointmentTime')?.value || 'Flexible';
      const masterStylist = document.getElementById('masterStylist')?.value || 'First Available Master Artist';

      const serviceListText = selectedServices.map(s => `• ${s.name} (₹${s.price.toLocaleString('en-IN')})`).join('%0A');

      const messageText = `✨ *LUXURY RESERVATION REQUEST - ÉCLAT SALON*%0A%0A` +
        `*Client:* ${encodeURIComponent(clientName)}%0A` +
        `*Phone:* ${encodeURIComponent(clientPhone)}%0A` +
        `*Date:* ${encodeURIComponent(appointmentDate)}%0A` +
        `*Time Slot:* ${encodeURIComponent(appointmentTime)}%0A` +
        `*Stylist Preference:* ${encodeURIComponent(masterStylist)}%0A%0A` +
        `*Selected Services:*%0A${serviceListText}%0A%0A` +
        `*Total Estimated Value:* ₹${totalPrice.toLocaleString('en-IN')}%0A%0A` +
        `Please confirm slot availability for my luxury experience.`;

      const whatsappUrl = `https://wa.me/919876543210?text=${messageText}`;

      // Show Success view
      const content = document.querySelector('.drawer-content');
      if (content) {
        content.innerHTML = `
          <div style="text-align: center; padding: 40px 10px;">
            <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(212,175,55,0.15); border: 1px solid #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #D4AF37; font-size: 2.2rem;">✓</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 12px; color: #FAF8F5;">Reservation Initiated</h3>
            <p style="color: #A3A8B7; font-size: 0.95rem; margin-bottom: 30px;">Thank you ${clientName}. Your appointment details have been prepared. Click below to complete instant confirmation with our Concierge via WhatsApp.</p>
            <a href="${whatsappUrl}" target="_blank" class="btn btn-gold" style="width: 100%;">
              <i class="fab fa-whatsapp"></i> Confirm via WhatsApp Concierge
            </a>
          </div>
        `;
      }
    });
  }

  updateStepView();
});
