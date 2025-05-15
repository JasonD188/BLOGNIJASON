import { signInWithGoogle, signOut, getCurrentUser, verifyEmail, isEmailVerified } from '../config/supabase.js'

export class AuthComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.user = null
    this.isVerified = false
  }

  async connectedCallback() {
    await this.checkAuth()
    this.render()
    this.addEventListeners()
  }

  async checkAuth() {
    try {
      this.user = await getCurrentUser()
      if (this.user) {
        this.isVerified = await isEmailVerified()
      }
      this.dispatchEvent(new CustomEvent('auth-state-changed', { 
        detail: { user: this.user, isVerified: this.isVerified } 
      }))
    } catch (error) {
      console.error('Auth error:', error)
      this.showError('Failed to check authentication status')
    }
  }

  addEventListeners() {
    const googleSignInBtn = this.shadowRoot.querySelector('.google-sign-in-btn')
    const verifyEmailBtn = this.shadowRoot.querySelector('.verify-email-btn')
    const signOutBtn = this.shadowRoot.querySelector('.sign-out-btn')

    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', () => this.handleGoogleSignIn())
    }
    if (verifyEmailBtn) {
      verifyEmailBtn.addEventListener('click', () => this.handleEmailVerification())
    }
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => this.handleSignOut())
    }
  }

  async handleGoogleSignIn() {
    try {
      const { user, error } = await signInWithGoogle()
      if (error) throw error
      
      this.user = user
      this.isVerified = await isEmailVerified()
      this.render()
      
      this.showSuccess('Successfully signed in with Google!')
      this.dispatchEvent(new CustomEvent('auth-state-changed', { 
        detail: { user: this.user, isVerified: this.isVerified } 
      }))
    } catch (error) {
      console.error('Sign in error:', error)
      this.showError('Failed to sign in with Google. Please try again.')
    }
  }

  async handleEmailVerification() {
    try {
      if (!this.user?.email) {
        throw new Error('No email address found')
      }
      
      const { error } = await verifyEmail(this.user.email)
      if (error) throw error
      
      this.showSuccess('Verification email sent! Please check your inbox.')
    } catch (error) {
      console.error('Verification error:', error)
      this.showError('Failed to send verification email. Please try again.')
    }
  }

  async handleSignOut() {
    try {
      const { error } = await signOut()
      if (error) throw error
      
      this.user = null
      this.isVerified = false
      this.render()
      
      this.showSuccess('Successfully signed out!')
      this.dispatchEvent(new CustomEvent('auth-state-changed', { 
        detail: { user: null, isVerified: false } 
      }))
    } catch (error) {
      console.error('Sign out error:', error)
      this.showError('Failed to sign out. Please try again.')
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'error-message'
    errorDiv.textContent = message
    this.shadowRoot.appendChild(errorDiv)
    setTimeout(() => errorDiv.remove(), 3000)
  }

  showSuccess(message) {
    const successDiv = document.createElement('div')
    successDiv.className = 'success-message'
    successDiv.textContent = message
    this.shadowRoot.appendChild(successDiv)
    setTimeout(() => successDiv.remove(), 3000)
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/components/auth.css');
      </style>
      <div class="auth-container">
        ${this.user
          ? `
            <div class="user-info">
              <img src="${this.user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/default?s=200'}" 
                   alt="User avatar" 
                   class="user-avatar">
              <div class="user-details">
                <span class="user-name">${this.user.user_metadata.full_name || this.user.email}</span>
                <span class="user-email">${this.user.email}</span>
                <div class="verification-status ${this.isVerified ? 'verified' : 'unverified'}">
                  ${this.isVerified ? '✓ Verified' : '✗ Unverified'}
                  ${!this.isVerified ? '<button class="verify-email-btn">Verify Email</button>' : ''}
                </div>
              </div>
              <button class="sign-out-btn">Sign Out</button>
            </div>
          `
          : `
            <button class="google-sign-in-btn">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                   alt="Google">
              Sign in with Google
            </button>
          `
        }
      </div>
    `
    this.addEventListeners()
  }
}

customElements.define('auth-component', AuthComponent) 