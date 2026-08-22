import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileStore } from '../store/profileStore';

const PrivacyPolicyScreen = ({ navigation }) => {
  const { theme } = useProfileStore();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      {/* Top Header Bar */}
      <LinearGradient
        colors={isDark ? ['#3b0764', '#1c1133'] : ['#7e22ce', '#9333ea']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </LinearGradient>

      {/* Policy Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.title, isDark && styles.darkText]}>BalaKatha Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: August 21, 2026</Text>

          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary]}>
            BalaKatha ("we", "our", or "us") is committed to protecting the privacy of children and parents who use our mobile application. This policy outlines how information is handled within the app.
          </Text>

          {/* Section 1 */}
          <Text style={[styles.sectionHeader, isDark && styles.darkSectionHeader]}>
            1. Children's Privacy (COPPA & GDPR-K)
          </Text>
          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary]}>
            BalaKatha is designed for children and families. We strictly comply with COPPA, GDPR-K, and Google Play's Families Policy:
          </Text>
          <Text style={[styles.bulletPoint, isDark && styles.darkTextSecondary]}>
            • <Text style={styles.boldText}>No Targeted Ads:</Text> BalaKatha contains zero third-party behavioral or targeted advertisements.
          </Text>
          <Text style={[styles.bulletPoint, isDark && styles.darkTextSecondary]}>
            • <Text style={styles.boldText}>No Data Selling:</Text> We never sell or trade any user information to third parties.
          </Text>

          {/* Section 2 */}
          <Text style={[styles.sectionHeader, isDark && styles.darkSectionHeader]}>
            2. Local Information & On-Device Storage
          </Text>
          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary]}>
            To personalize story experiences (e.g. inserting family names into tales), parents or children can enter:
          </Text>
          <Text style={[styles.bulletPoint, isDark && styles.darkTextSecondary]}>• Kid's Name, Father's Name & Mother's Name</Text>
          <Text style={[styles.bulletPoint, isDark && styles.darkTextSecondary]}>• Preferred Narration Language & Reader Gender</Text>

          <View style={[styles.highlightBox, isDark && styles.darkHighlightBox]}>
            <Text style={[styles.highlightText, isDark && styles.darkHighlightText]}>
              🔒 <Text style={{ fontWeight: 'bold' }}>Stored Locally Only:</Text> This information is stored exclusively on your device. It is never uploaded to, saved on, or harvested by external servers.
            </Text>
          </View>

          {/* Section 3 */}
          <Text style={[styles.sectionHeader, isDark && styles.darkSectionHeader]}>
            3. Diagnostics & Performance
          </Text>
          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary]}>
            To ensure app stability, we use minimal third-party diagnostic services:
          </Text>
          <Text style={[styles.bulletPoint, isDark && styles.darkTextSecondary]}>
            • <Text style={styles.boldText}>Firebase Crashlytics:</Text> Anonymized crash logs to fix technical errors.
          </Text>
          <Text style={[styles.bulletPoint, isDark && styles.darkTextSecondary]}>
            • <Text style={styles.boldText}>PostHog Analytics:</Text> Aggregated, non-personally identifiable usage statistics.
          </Text>
          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary, { marginTop: 6 }]}>
            We do not collect Advertising IDs (AAID/IDFA) or precise location data from child users.
          </Text>

          {/* Section 4 */}
          <Text style={[styles.sectionHeader, isDark && styles.darkSectionHeader]}>
            4. Data Retention & Controls
          </Text>
          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary]}>
            You have total control over saved data. Clearing profile names, quiz scores, or uninstalling the app permanently removes all locally stored data from your device.
          </Text>

          {/* Section 5 */}
          <Text style={[styles.sectionHeader, isDark && styles.darkSectionHeader]}>
            5. Contact Us
          </Text>
          <Text style={[styles.paragraph, isDark && styles.darkTextSecondary]}>
            If you have questions regarding this privacy policy, feel free to reach out:
          </Text>
          <View style={styles.contactContainer}>
            <Text style={styles.contactEmail}>✉️ kantetivarshit999@gmail.com</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.closeBtnText}>Close Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf9',
  },
  darkContainer: {
    backgroundColor: '#120b24',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  darkCard: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7e22ce',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7e22ce',
    marginTop: 18,
    marginBottom: 8,
  },
  darkSectionHeader: {
    color: '#c084fc',
  },
  paragraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginLeft: 4,
    marginTop: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#334155',
  },
  darkText: {
    color: '#f3e8ff',
  },
  darkTextSecondary: {
    color: '#cbd5e1',
  },
  highlightBox: {
    backgroundColor: '#faf5ff',
    borderLeftWidth: 4,
    borderLeftColor: '#9333ea',
    padding: 12,
    borderRadius: 8,
    marginVertical: 14,
  },
  darkHighlightBox: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderLeftColor: '#c084fc',
  },
  highlightText: {
    fontSize: 13,
    color: '#6b21a8',
    lineHeight: 19,
  },
  darkHighlightText: {
    color: '#e9d5ff',
  },
  contactContainer: {
    backgroundColor: '#f3e8ff',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  closeBtn: {
    backgroundColor: '#9333ea',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PrivacyPolicyScreen;
