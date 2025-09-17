// Professional NFC Review Collection App with Separate Business Data
class NFCReviewApp {
  constructor() {
    this.currentBusiness = null;
    this.googleSheetsWebhook =
      "https://script.google.com/macros/s/AKfycbxXSF_YpNnLEs4NMrmkQhnuBbR5wAmXWkugWvV4E9jNKSM1jDPStUITEPaC5xJ2Juj-/exec";
    this.businessesJsonUrl = "businesses.json";
    this.welcomeShown = false;
    this.init();
  }

  // Initialize the application
  async init() {
    this.bindEvents();
    await this.showWelcomeAnimation();
    await this.loadBusinessFromURL();
  }

  // Welcome Animation Sequence
  async showWelcomeAnimation() {
    const welcomeOverlay = document.getElementById("welcomeOverlay");
    const welcomeTitle = document.getElementById("welcomeTitle");
    const welcomeSubtitle = document.getElementById("welcomeSubtitle");

    // Show initial welcome message
    await this.delay(800);

    // Update to preparing message
    welcomeTitle.textContent = "Thank you for tapping!";
    welcomeSubtitle.textContent = "Preparing your personalized experience...";

    await this.delay(2200);

    // Fade out welcome overlay
    welcomeOverlay.classList.add("fade-out");

    // Show main card
    const mainCard = document.getElementById("mainCard");
    setTimeout(() => {
      mainCard.classList.add("show");
      welcomeOverlay.style.display = "none";
      this.welcomeShown = true;
    }, 800);
  }

  // Load business data from external JSON file with fallback
  async loadBusinessData() {
    try {
      // Try to load from external businesses.json file
      const response = await fetch(this.businessesJsonUrl);
      if (response.ok) {
        const businessData = await response.json();
        return businessData;
      }
      throw new Error("Failed to load external business data");
    } catch (error) {
      console.log("Loading fallback business data...");
      // Fallback to embedded business database for demo purposes
      return this.getFallbackBusinessDatabase();
    }
  }

  // Fallback business database (structured like external JSON would be)
  getFallbackBusinessDatabase() {
    return {
      "sunrise-cafe": {
        id: "sunrise-cafe",
        name: "Sunrise Coffee & Bakery",
        type: "Coffee Shop",
        description: "Artisanal coffee and fresh baked goods since 2015",
        logo: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop&crop=center",
        googleReviewUrl: "https://g.page/r/CfDHMYAWNXHHEBM/review",
        socialMedia: {
          facebook: "https://facebook.com/sunrisecoffee",
          instagram: "https://instagram.com/sunrisecoffee",
          website: "https://sunrisecoffee.com",
        },
      },
      "artisan-brew-house": {
        id: "artisan-brew-house",
        name: "Artisan Brew House",
        type: "Coffee Shop",
        description:
          "Specialty single-origin coffee and handcrafted pastries in downtown since 2018",
        logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop&crop=center",
        googleReviewUrl: "https://g.page/r/CaRtIsAnBrEwHoUsE/review",
        socialMedia: {
          facebook: "https://facebook.com/artisanbrewhouse",
          instagram: "https://instagram.com/artisanbrewhouse",
          website: "https://artisanbrewhouse.com",
        },
      },
      "quick-fix-auto": {
        id: "quick-fix-auto",
        name: "Quick Fix Auto Repair",
        type: "Auto Repair",
        description: "Professional automotive service and repair",
        logo: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=200&h=200&fit=crop&crop=center",
        googleReviewUrl: "https://www.youtube.com",
        socialMedia: {
          facebook: "https://facebook.com/quickfixauto",
          instagram: "https://instagram.com/quickfixauto",
          website: "https://creaticomsolutions.com",
        },
      },
      "bella-salon": {
        id: "bella-salon",
        name: "Bella Hair & Beauty Salon",
        type: "Hair Salon",
        description: "Premium hair styling and beauty treatments",
        logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop&crop=center",
        googleReviewUrl: "https://g.page/r/CfDHMYAWNXHHEBM/review",
        socialMedia: {
          instagram: "https://instagram.com/bellasalon",
          website: "https://bellasalon.com",
        },
      },
      "fitness-first": {
        id: "fitness-first",
        name: "Fitness First Gym",
        type: "Fitness Center",
        description: "24/7 fitness center with personal training",
        logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
        googleReviewUrl: "https://g.page/r/CfDHMYAWNXHHEBM/review",
        socialMedia: {
          facebook: "https://facebook.com/fitnessfirstgym",
          instagram: "https://instagram.com/fitnessfirst",
          website: "https://fitnessfirst.com",
        },
      },
      "downtown-dental": {
        id: "downtown-dental",
        name: "Downtown Dental Care",
        type: "Dental Office",
        description: "Comprehensive dental care for the whole family",
        logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop&crop=center",
        googleReviewUrl: "https://g.page/r/CfDHMYAWNXHHEBM/review",
        socialMedia: {
          facebook: "https://facebook.com/downtowndental",
          website: "https://downtowndental.com",
        },
      },
    };
  }

  // Bind event listeners
  bindEvents() {
    const form = document.getElementById("reviewForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    // Real-time form validation
    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");

    if (nameInput) {
      nameInput.addEventListener("blur", () => this.validateName());
      nameInput.addEventListener("input", () => this.clearError("nameError"));
    }

    if (emailInput) {
      emailInput.addEventListener("blur", () => this.validateEmail());
      emailInput.addEventListener("input", () => this.clearError("emailError"));
    }
  }

  // Get URL parameters
  getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Load business data from URL parameter
  async loadBusinessFromURL() {
    try {
      const businessId = this.getURLParameter("id") || "sunrise-cafe"; // Default for demo

      // Wait for welcome animation
      while (!this.welcomeShown) {
        await this.delay(100);
      }

      // Load business database
      const businessDatabase = await this.loadBusinessData();

      if (!businessDatabase[businessId]) {
        this.showError("Business not found");
        return;
      }

      this.currentBusiness = businessDatabase[businessId];
      await this.displayBusinessData(this.currentBusiness);
    } catch (error) {
      console.error("Error loading business:", error);
      this.showError("Failed to load business information");
    }
  }

  // Display business data in the interface
  async displayBusinessData(business) {
    try {
      // Update logo with loading fallback
      const logoImg = document.getElementById("businessLogo");
      if (logoImg) {
        logoImg.onload = () => {
          logoImg.style.opacity = "1";
          logoImg.style.transform = "scale(1)";
        };
        logoImg.onerror = () => {
          logoImg.src = this.getDefaultLogo(business.type);
        };
        logoImg.style.opacity = "0";
        logoImg.style.transform = "scale(0.8)";
        logoImg.src = business.logo;
        logoImg.alt = `${business.name} Logo`;
      }

      // Update headlines
      const mainHeadline = document.getElementById("mainHeadline");
      const subHeadline = document.getElementById("subHeadline");

      if (mainHeadline) {
        mainHeadline.textContent = `Thank you for visiting ${business.name}!`;
      }

      if (subHeadline) {
        subHeadline.textContent =
          business.description ||
          "Your feedback helps us improve and serve you better";
      }

      // Setup social media links
      this.setupSocialLinks(business.socialMedia);

      // Show main content
      this.showMainContent();
    } catch (error) {
      console.error("Error displaying business data:", error);
      this.showError("Failed to display business information");
    }
  }

  // Setup social media links
  setupSocialLinks(socialMedia) {
    const socialIcons = {
      facebook: document.getElementById("facebookLink"),
      instagram: document.getElementById("instagramLink"),
      website: document.getElementById("websiteLink"),
    };

    // Hide all social links first
    Object.values(socialIcons).forEach((icon) => {
      if (icon) {
        icon.classList.add("hidden");
        icon.href = "#";
      }
    });

    // Show and configure available social links
    if (socialMedia) {
      Object.entries(socialMedia).forEach(([platform, url]) => {
        const icon = socialIcons[platform];
        if (icon && url) {
          icon.href = url;
          icon.classList.remove("hidden");
          // Ensure links open in new tab
          icon.setAttribute("target", "_blank");
          icon.setAttribute("rel", "noopener noreferrer");
        }
      });
    }
  }

  // Get default logo for business type
  getDefaultLogo(businessType) {
    const defaultLogos = {
      "Coffee Shop":
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop&crop=center",
      "Auto Repair":
        "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=200&h=200&fit=crop&crop=center",
      "Hair Salon":
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop&crop=center",
      "Fitness Center":
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
      "Dental Office":
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop&crop=center",
      Default:
        "https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=200&h=200&fit=crop&crop=center",
    };

    return defaultLogos[businessType] || defaultLogos["Default"];
  }

  // Form validation methods
  validateName() {
    const nameInput = document.getElementById("customerName");
    const name = nameInput ? nameInput.value.trim() : "";

    if (!name) {
      this.showFieldError("nameError", "Please enter your full name");
      return false;
    } else if (name.length < 2) {
      this.showFieldError("nameError", "Please enter a valid name");
      return false;
    } else {
      this.clearError("nameError");
      return true;
    }
  }

  validateEmail() {
    const emailInput = document.getElementById("customerEmail");
    const email = emailInput ? emailInput.value.trim() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.showFieldError("emailError", "Please enter your email address");
      return false;
    } else if (!emailRegex.test(email)) {
      this.showFieldError("emailError", "Please enter a valid email address");
      return false;
    } else {
      this.clearError("emailError");
      return true;
    }
  }

  // Show form validation error
  showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }

  // Clear form validation error
  clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }
  }

  // Handle form submission
  async handleFormSubmit(e) {
    e.preventDefault();

    // Clear any existing errors
    this.clearError("nameError");
    this.clearError("emailError");

    // Validate form
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();

    if (!isNameValid || !isEmailValid) {
      return;
    }

    const submitButton = document.getElementById("submitButton");
    const btnText = submitButton.querySelector(".btn-text");
    const btnSpinner = submitButton.querySelector(".btn-spinner");

    try {
      // Show loading state
      submitButton.disabled = true;
      btnText.textContent = "Submitting...";
      btnSpinner.classList.remove("hidden");

      // Collect form data
      const formData = this.collectFormData();

      // Submit to Google Sheets
      await this.submitToGoogleSheets(formData);

      // Show success and redirect
      this.showSuccess();

      // Redirect to Google Reviews after delay
      setTimeout(() => {
        if (this.currentBusiness && this.currentBusiness.googleReviewUrl) {
          window.open(this.currentBusiness.googleReviewUrl, "_blank");
        }
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);

      // Show user-friendly error message
      alert(
        "There was an error submitting your information. Please try again."
      );

      // Reset button state
      submitButton.disabled = false;
      btnText.textContent = "Continue to Review";
      btnSpinner.classList.add("hidden");
    }
  }

  // Collect form data
  collectFormData() {
    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");
    const consentCheckbox = document.getElementById("marketingConsent");

    return {
      businessId: this.currentBusiness ? this.currentBusiness.id : "",
      businessName: this.currentBusiness ? this.currentBusiness.name : "",
      businessType: this.currentBusiness ? this.currentBusiness.type : "",
      customerName: nameInput ? nameInput.value.trim() : "",
      customerEmail: emailInput ? emailInput.value.trim() : "",
      marketingConsent: consentCheckbox ? consentCheckbox.checked : false,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      source: "NFC",
    };
  }

  // Submit data to Google Sheets
  async submitToGoogleSheets(formData) {
    try {
      const response = await fetch(this.googleSheetsWebhook, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Simulate processing time for better UX
      await this.delay(1000);

      return true;
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      throw error;
    }
  }

  // Show different app states
  showLoadingState() {
    this.hideAllStates();
    const loadingState = document.getElementById("loadingState");
    if (loadingState) {
      loadingState.classList.remove("hidden");
    }
  }

  showMainContent() {
    this.hideAllStates();
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.classList.remove("hidden");
    }
  }

  showError(message = "Business not found") {
    this.hideAllStates();
    const errorState = document.getElementById("errorState");
    if (errorState) {
      errorState.classList.remove("hidden");

      const errorText = errorState.querySelector("p");
      if (errorText && message) {
        errorText.textContent = message;
      }
    }
  }

  showSuccess() {
    this.hideAllStates();
    const successState = document.getElementById("successState");
    if (successState) {
      successState.classList.remove("hidden");

      const successMessage = document.getElementById("successMessage");
      if (successMessage && this.currentBusiness) {
        successMessage.textContent = `Thank you for visiting ${this.currentBusiness.name}! Your feedback helps us serve you better.`;
      }
    }
  }

  hideAllStates() {
    const states = [
      "loadingState",
      "mainContent",
      "errorState",
      "successState",
    ];
    states.forEach((stateId) => {
      const element = document.getElementById(stateId);
      if (element) {
        element.classList.add("hidden");
      }
    });
  }

  // Utility function for delays
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.nfcApp = new NFCReviewApp();
});

// Handle page visibility changes (useful for NFC tap scenarios)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    console.log("Page became visible - potential NFC interaction detected");
  }
});

// Export for module usage (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = NFCReviewApp;
}
