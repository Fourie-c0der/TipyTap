// Help and support screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../src/constants/colors';
import { config } from '../../src/constants/config';

export default function HelpScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'How do I tip a car guard?',
      answer: 'Select an amount from the home screen, scan the car guard\'s QR code, and confirm the payment. The tip will be instantly transferred to their account.',
    },
    {
      question: 'How do I add money to my wallet?',
      answer: 'Go to your Profile, tap "Add Funds", enter the amount, and complete the payment with your card or bank account.',
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Withdrawals are processed within 1-3 business days. You\'ll receive the funds in your registered bank account.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes! We use bank-level encryption and comply with PCI DSS standards to keep your payment information safe.',
    },
    {
      question: 'What if I scan the wrong QR code?',
      answer: 'You\'ll see a confirmation screen with the car guard\'s details before completing the payment. Always verify before confirming.',
    },
    {
      question: 'Can I get a refund for a tip?',
      answer: 'Tips are final and cannot be refunded. Please ensure you\'re tipping the correct car guard before confirming.',
    },
    {
      question: 'How do car guards receive their tips?',
      answer: 'Car guards receive tips instantly in their CarGuard account. They can withdraw funds to their bank account anytime.',
    },
    {
      question: 'What are the fees?',
      answer: 'There are no fees for tipping. We charge a small processing fee for withdrawals to cover banking costs.',
    },
  ];

  const handleContactSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => {
        setShowContactForm(false);
        setName('');
        setEmail('');
        setMessage('');
      }}]
    );
  };

  const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
    const isExpanded = expandedFaq === index;
    
    return (
      <TouchableOpacity
        style={styles.faqCard}
        onPress={() => setExpandedFaq(isExpanded ? null : index)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.primary}
          />
        </View>
        {isExpanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ImageBackground source={require('../../src/assets/images/background.png')}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>We{'\''}re here to help you</Text>
      </View>

      {/* Quick Contact Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL(`mailto:${config.SUPPORT_EMAIL}`)}
          >
            <View style={[styles.contactIcon, { backgroundColor: colors.info + '20' }]}>
              <Ionicons name="mail" size={24} color={colors.info} />
            </View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{config.SUPPORT_EMAIL}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL(`tel:${config.SUPPORT_PHONE.replace(/\s/g, '')}`)}
          >
            <View style={[styles.contactIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="call" size={24} color={colors.success} />
            </View>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{config.SUPPORT_PHONE}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Form Toggle */}
      {!showContactForm ? (
        <TouchableOpacity
          style={styles.formToggleButton}
          onPress={() => setShowContactForm(true)}
        >
          <Ionicons name="chatbubbles" size={20} color={colors.primary} />
          <Text style={styles.formToggleText}>Send us a message</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.contactForm}>
          <Text style={styles.sectionTitle}>Send Message</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowContactForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.sendButton]}
              onPress={handleContactSubmit}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} index={index} />
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>
          {config.APP_NAME} v{config.APP_VERSION}
        </Text>
        <Text style={styles.appInfoSubtext}>
          Empowering Car Guards Across South Africa
        </Text>
      </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  formToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  formToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  contactForm: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#3A3A3A',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  faqCard: {
    backgroundColor: '#3A3A3A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingBottom: 25
  },
  appInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
});