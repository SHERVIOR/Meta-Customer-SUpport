
export interface Topic {
  id: string;
  question: string;
  response: string;
}

export const questTopics: Topic[] = [
  {
    id: "setup",
    question: "How do I set up my new Meta Quest?",
    response: "To set up your new Meta Quest headset:\n\n1. Download the Meta Quest app on your smartphone\n2. Turn on your headset and follow the on-screen instructions\n3. Connect to Wi-Fi through the app\n4. Create or log in to your Meta account\n5. Set up your Guardian boundary\n6. Complete the orientation tutorial\n\nIf you have any issues during setup, try restarting both your headset and phone."
  },
  {
    id: "battery",
    question: "Why is my Quest battery draining so quickly?",
    response: "Several factors can cause faster battery drain on your Meta Quest:\n\n• Playing graphics-intensive games\n• Using at high brightness settings\n• Having background apps running\n• Outdated software\n• Battery degradation over time\n\nTips to improve battery life:\n• Lower the brightness\n• Turn off the headset when not in use\n• Use power-saving modes if available\n• Close unused apps\n• Update to the latest software\n• Consider an external battery pack for extended sessions"
  },
  {
    id: "tracking",
    question: "My Quest controllers aren't tracking properly",
    response: "If your Meta Quest controllers aren't tracking properly:\n\n1. Ensure adequate lighting in your play area (not too bright or too dim)\n2. Check that the controller's tracking ring isn't blocked or damaged\n3. Replace batteries if power is low\n4. Clean the controller's tracking ring and headset cameras\n5. Restart your headset\n6. Pair the controllers again in the device settings\n\nIf problems persist, try resetting your Guardian boundary or performing a factory reset as a last resort."
  },
  {
    id: "games",
    question: "What are the best games available on Meta Quest?",
    response: "Popular Meta Quest games by category:\n\n• Action/Adventure: Resident Evil 4, The Walking Dead: Saints & Sinners\n• Rhythm/Fitness: Beat Saber, Supernatural, FitXR\n• Shooters: Population: One, Contractors, Onward\n• Puzzle: I Expect You To Die, The Room VR\n• Social: Rec Room, VRChat, Horizon Worlds\n• Sports: Golf+, Eleven Table Tennis\n• Horror: Five Nights at Freddy's: Help Wanted, Lies Beneath\n\nNew titles are released regularly in the Meta Quest Store, with both paid and free options available."
  },
  {
    id: "warranty",
    question: "How do I submit a warranty claim?",
    response: "To submit a warranty claim for your Meta Quest:\n\n1. Visit support.meta.com/quest\n2. Log in with your Meta account\n3. Select your device and the issue you're experiencing\n4. Follow the troubleshooting steps provided\n5. If the issue persists, select the option to contact support\n6. Provide your proof of purchase and device serial number when requested\n\nMeta Quest headsets typically come with a 1-year limited warranty. Support options include repair, replacement, or refund depending on the issue and warranty status."
  }
];
