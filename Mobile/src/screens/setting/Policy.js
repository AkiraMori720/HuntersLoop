import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
  TextInput,
  ImageBackground,
  Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { Colors, Images } from '@constants';

export default function PolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Privacy Policy</Text>
        </View>
      </View>

      <ScrollView style={styles.policyContainer}>
        <Text style={styles.txt}>
        We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert
you about any changes by updating the “Last updated” date of this Privacy Policy. You are encouraged
to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been
made aware of, will be subject to, and will be deemed to have accepted the changes in any revised
Privacy Policy by your continued use of the Application after the date such revised Privacy Policy is
posted.{'\n'}{'\n'}
This Privacy Policy does not apply to the third-party online/mobile store from which you install the
Application or make payments, including any in-game virtual items, which may also collect and use data
about you. We are not responsible for any of the data collected by any such third party.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        COLLECTION OF YOUR INFORMATION
        </Text>
        <Text style={styles.txt}>
        We may collect information about you in a variety of ways. The information we may collect via the
Application depends on the content and materials you use, and includes:{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        COLLECTION OF YOUR INFORMATION
        </Text>
        <Text style={styles.txt}>
        We may collect information about you in a variety of ways. The information we may collect via the
Application depends on the content and materials you use, and includes:{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Personal Data
        </Text>
        <Text style={styles.txt}>
        Demographic and other personally identifiable information (such as your name and email address) that
you voluntarily give to us when choosing to participate in various activities related to the Application,
such as chat, posting messages in comment sections or in our forums, liking posts, sending feedback,
and responding to surveys. If you choose to share data about yourself via your profile, online chat, or
other interactive areas of the Application, please be advised that all data you disclose in these areas is
public and your data will be accessible to anyone who accesses the Application.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Derivative Data
        </Text>
        <Text style={styles.txt}>
        Information our servers automatically collect when you access the Application, such as your native
actions that are integral to the Application, including liking, re-blogging, or replying to a post, as well as
other interactions with the Application and other users via server log files.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Financial Data
        </Text>
        <Text style={styles.txt}>
        Financial information, such as data related to your payment method (e.g. valid credit card number, card
brand, expiration date) that we may collect when you purchase, order, return, exchange, or request
information about our services from the Application. [We store only very limited, if any, financial
information that we collect. Otherwise, all financial information is stored by our payment processor,
Stripe, and you are encouraged to review their privacy policy and contact them directly for responses to
your questions.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Facebook Permissions
        </Text>
        <Text style={styles.txt}>
        The Application may by default access your Facebook basic account information, including your name,
email, gender, birthday, current city, and profile picture URL, as well as other information that you
choose to make public. We may also request access to other permissions related to your account, such
as friends, checkins, and likes, and you may choose to grant or deny us access to each individual
permission. For more information regarding Facebook permissions, refer to the Facebook Permissions
Reference page.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Data from Social Networks
        </Text>
        <Text style={styles.txt}>
        User information from social networking sites, such as [Apple’s Game Center, Facebook, Google+
Instagram, Pinterest, Twitter], including your name, your social network username, location, gender, birth
date, email address, profile picture, and public data for contacts, if you connect your account to such
social networks. This information may also include the contact information of anyone you invite to use
and/or join the Application.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Geo-Location Information
        </Text>
        <Text style={styles.txt}>
        We may request access or permission to and track location-based information from your mobile device,
either continuously or while you are using the Application, to provide location-based services. If you wish
to change our access or permissions, you may do so in your device’s settings.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Mobile Device Access
        </Text>
        <Text style={styles.txt}>
        We may request access or permission to certain features from your mobile device, including your mobile
device’s [bluetooth, calendar, camera, contacts, microphone, reminders, sensors, SMS messages, social
media accounts, storage,] and other features. If you wish to change our access or permissions, you may
do so in your device’s settings.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Mobile Device Data
        </Text>
        <Text style={styles.txt}>
        Device information such as your mobile device ID number, model, and manufacturer, version of your
operating system, phone number, country, location, and any other data you choose to provide.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Push Notifications
        </Text>
        <Text style={styles.txt}>
        We may request to send you push notifications regarding your account or the Application. If you wish to
opt-out from receiving these types of communications, you may turn them off in your device’s settings.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Third-Party Data
        </Text>
        <Text style={styles.txt}>
        Information from third parties, such as personal information or network friends, if you connect your
account to the third party and grant the Application permission to access this information.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Data From Contests, Giveaways, and Surveys  
        </Text>
        <Text style={styles.txt}>
        Personal and other information you may provide when entering contests or giveaways and/or responding
to surveys.{'\n'}
        </Text>

        <Text style={styles.tagTxt1}>
        USE OF YOUR INFORMATION  
        </Text>
        <Text style={styles.txt}>
Having accurate information about you permits us to provide you with a smooth, efficient, and
customized experience. Specifically, we may use information collected about you via the Application to:{'\n'}{'\n'}
1. Administer sweepstakes, promotions, and contests.{'\n'}
2. Assist law enforcement and respond to subpoena.{'\n'}
3. Compile anonymous statistical data and analysis for use internally or with third parties.{'\n'}
4. Create and manage your account.{'\n'}
5. Deliver targeted advertising, coupons, newsletters, and other information regarding promotions
and the Application to you.{'\n'}
6. Email you regarding your account or order.{'\n'}
7. Enable user-to-user communications.{'\n'}
8. Fulfill and manage purchases, orders, payments, and other transactions related to the
Application.{'\n'}
9. Generate a personal profile about you to make future visits to the Application more personalized.{'\n'}
10. Increase the efficiency and operation of the Application.{'\n'}
11. Monitor and analyze usage and trends to improve your experience with the Application.{'\n'}
12. Notify you of updates to the Application.{'\n'}
13. Offer new products, services, mobile applications, and/or recommendations to you.{'\n'}
14. Perform other business activities as needed.{'\n'}
15. Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.{'\n'}
16. Process payments and refunds.{'\n'}
17. Request feedback and contact you about your use of the Application.{'\n'}
18. Resolve disputes and troubleshoot problems.{'\n'}
19. Respond to product and customer service requests.{'\n'}
20. Send you a newsletter.{'\n'}
21. Solicit support for the Application.{'\n'}
22. [Other]{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        DISCLOSURE OF YOUR INFORMATION 
        </Text>
        <Text style={styles.txt}>
        We may share information we have collected about you in certain situations. Your information may be
disclosed as follows:{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        By Law or to Protect Rights
        </Text>
        <Text style={styles.txt}>
        If we believe the release of information about you is necessary to respond to legal process, to investigate
or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we
may share your information as permitted or required by any applicable law, rule, or regulation. This
includes exchanging information with other entities for fraud protection and credit risk reduction.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Third-Party Service Providers
        </Text>
        <Text style={styles.txt}>
        We may share your information with third parties that perform services for us or on our behalf, including
payment processing, data analysis, email delivery, hosting services, customer service, and marketing
assistance.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Marketing Communications
        </Text>
        <Text style={styles.txt}>
        With your consent, or with an opportunity for you to withdraw consent, we may share your information
with third parties for marketing purposes, as permitted by law.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Interactions with Other Users
        </Text>
        <Text style={styles.txt}>
        If you interact with other users of the Application, those users may see your name, profile photo, and
descriptions of your activity, including sending invitations to other users, chatting with other users, liking
posts, following blogs.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Online Postings
        </Text>
        <Text style={styles.txt}>
        When you post comments, contributions or other content to the Applications, your posts may be viewed
by all users and may be publicly distributed outside the Application in perpetuity{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Third-Party Advertisers
        </Text>
        <Text style={styles.txt}>
        We may use third-party advertising companies to serve ads when you visit the Application. These
companies may use information about your visits to the Application and other websites that are
contained in web cookies in order to provide advertisements about goods and services of interest to you.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Affiliates
        </Text>
        <Text style={styles.txt}>
        We may share your information with our affiliates, in which case we will require those affiliates to honor
this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners or
other companies that we control or that are under common control with us.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Business Partners
        </Text>
        <Text style={styles.txt}>
        We may share your information with our business partners to offer you certain products, services or
promotions.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Offer Wall
        </Text>
        <Text style={styles.txt}>
        The Application may display a third-party-hosted “offer wall.” Such an offer wall allows third-party
advertisers to offer virtual currency, gifts, or other items to users in return for acceptance and completion
of an advertisement offer. Such an offer wall may appear in the Application and be displayed to you
based on certain data, such as your geographic area or demographic information. When you click on an
offer wall, you will leave the Application. A unique identifier, such as your user ID, will be shared with the
offer wall provider in order to prevent fraud and properly credit your account.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Social Media Contacts
        </Text>
        <Text style={styles.txt}>
        If you connect to the Application through a social network, your contacts on the social network will see
your name, profile photo, and descriptions of your activity.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Other Third Parties
        </Text>
        <Text style={styles.txt}>
        We may share your information with advertisers and investors for the purpose of conducting general
business analysis. We may also share your information with such third parties for marketing purposes, as
permitted by law.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Sale or Bankruptcy
        </Text>
        <Text style={styles.txt}>
        If we reorganize or sell all or a portion of our assets, undergo a merger, or are acquired by another entity,
we may transfer your information to the successor entity. If we go out of business or enter bankruptcy,
your information would be an asset transferred or acquired by a third party. You acknowledge that such
transfers may occur and that the transferee may decline honor commitments we made in this Privacy
Policy.{'\n'}{'\n'}

We are not responsible for the actions of third parties with whom you share personal or sensitive data,
and we have no authority to manage or control third-party solicitations. If you no longer wish to receive
correspondence, emails or other communications from third parties, you are responsible for contacting
the third party directly.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        TRACKING TECHNOLOGIES
        </Text>
        <Text style={styles.tagTxt2}>
        Cookies and Web Beacons
        </Text>
        <Text style={styles.txt}>
        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Application to
help customize the Application and improve your experience. When you access the Application, your
personal information is not collected through the use of tracking technology. Most browsers are set to
accept cookies by default. You can remove or reject cookies, but be aware that such action could affect
the availability and functionality of the Application. You may not decline web beacons. However, they can
be rendered ineffective by declining all cookies or by modifying your web browser’s settings to notify you
each time a cookie is tendered, permitting you to accept or decline cookies on an individual basis.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Internet-Based Advertising
        </Text>
        <Text style={styles.txt}>
        Additionally, we may use third-party software to serve ads on the Application, implement email marketing
campaigns, and manage other interactive marketing initiatives. This third-party software may use
cookies or similar tracking technology to help manage and optimize your online experience with us. For
more information about opting-out of interest-based ads, visit the Network Advertising Initiative Opt-Out
Tool or Digital Advertising Alliance Opt-Out Tool.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        THIRD-PARTY WEBSITES
        </Text>
        <Text style={styles.txt}>
        The Application may contain links to third-party websites and applications of interest, including
advertisements and external services, that are not affiliated with us. Once you have used these links to
leave the Application, any information you provide to these third parties is not covered by this Privacy
Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing
any information to any third-party websites, you should inform yourself of the privacy policies and
practices (if any) of the third party responsible for that website, and should take those steps necessary
to, in your discretion, protect the privacy of your information. We are not responsible for the content or
privacy and security practices and policies of any third parties, including other sites, services or
applications that may be linked to or from the Application.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        SECURITY OF YOUR INFORMATION
        </Text>
        <Text style={styles.txt}>
        We use administrative, technical, and physical security measures to help protect your personal
information. While we have taken reasonable steps to secure the personal information you provide to
us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
method of data transmission can be guaranteed against any interception or other type of misuse. Any
information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore,
we cannot guarantee complete security if you provide personal information.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        POLICY FOR CHILDREN
        </Text>
        <Text style={styles.txt}>
        We do not knowingly solicit information from or market to children under the age of 13. If you become
aware of any data we have collected from children under age 13, please contact us using the contact
information provided below.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        CONTROLS FOR DO-NOT-TRACK FEATURES
        </Text>
        <Text style={styles.txt}>
        Most web browsers and some mobile operating systems [and our mobile applications] include a Do-Not-
Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about

your online browsing activities monitored and collected. No uniform technology standard for recognizing
and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser
signals or any other mechanism that automatically communicates your choice not to be tracked online. If
a standard for online tracking is adopted that we must follow in the future, we will inform you about that
practice in a revised version of this Privacy Policy.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        CALIFORNIA PRIVACY RIGHTS
        </Text>
        <Text style={styles.txt}>
        California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits our users who
are California residents to request and obtain from us, once a year and free of charge, information about
categories of personal information (if any) we disclosed to third parties for direct marketing purposes and
the names and addresses of all third parties with which we shared personal information in the
immediately preceding calendar year. If you are a California resident and would like to make such a
request, please submit your request in writing to us using the contact information provided below.
If you are under 18 years of age, reside in California, and have a registered account with the Application,
you have the right to request removal of unwanted data that you publicly post on the Application. To
request removal of such data, please contact us using the contact information provided below, and
include the email address associated with your account and a statement that you reside in California.
We will make sure the data is not publicly displayed on the Application, but please be aware that the data
may not be completely or comprehensively removed from our systems.{'\n'}{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        CONTACT US
        </Text>
        <Text style={styles.txt}>
        In order to resolve a complaint regarding the App or to receive further information regarding use of the
App, please contact us at:{'\n'}{'\n'}
[Hunters Loop LLC]{'\n'}
[1248 FM 889 George West, Texas 78022]{'\n'}
[361-492-0736]{'\n'}
[jamesstroleny@yahoo.com]{'\n'}{'\n'}{'\n'}{'\n'}
        </Text>
      </ScrollView>

    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.greyWeakColor,
  },
  header: {
    width: '100%',
    height: normalize(70, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
  },
  iconBackContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
  },
  titleTxt: {
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  policyContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginTop: normalize(15, 'height'),
    marginBottom: normalize(15, 'height'),
    padding: normalize(10),
    borderRadius: normalize(7),
  },
  tagTxt1: {
    fontSize: RFPercentage(3),
    color: Colors.blackColor,
  },
  tagTxt2: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
  },
  txt: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },

});