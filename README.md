# Storefront barbershop with booking form

### Next.js starter template with form to Firebase

To start, rename <code>preset.env</code> to <code>.env</code> and fill out the variable fields.

Go to your [Firebase Console](https://console.firebase.google.com/) and whitelist the domain name. <code>localhost</code> should be there by default, so make sure your custom domain is added. Here's how to do that:

1. Click on **Authentication**. If you can't see it, expand the sidebar on the left side of the screen.
2. Select **Settings**.
3. Scroll down to **Authorized Domains**.
4. Click **Add domain**.
5. Enter your domain in the format <em>example.com</em>.

### Current Schemas

Currently, these three collections are required by default. <code>barbers</code> and <code>services</code> must be populated beforehand to appear in the storefront's booking form as <code>SelectItem</code>s. The <code>bookings</code> collection will be populated when a user submits the form. 

<em>Auto-ID fields are not included.</em>

* barbers
    - avatarUrl: string
    - name: string
___
* bookings
    - barber: string
    - bookingTime: timestamp
    - clientName: string
    - clientPhone: string
    - createdAt: timestamp
    - service: string
    - status: string
___
* services
    - description: string
    - duration: number
    - name: string
    - price: number