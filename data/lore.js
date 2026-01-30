/**
 * PEBBLES PUZZLES - Lore & Dialog System
 *
 * Dialog entries that appear before/after levels
 * Each entry has an id that corresponds to loreId in level data
 */

const LORE = {
  // ============================================
  // WORLD 1: AWAKENING
  // ============================================

  "intro_1": {
    speaker: null,
    portrait: null,
    lines: [
      { text: "...", delay: 1500 },
      { text: "Darkness.", delay: 1000 },
      { text: "You don't know where you are.", delay: 1500 },
      { text: "You don't know who you are.", delay: 1500 },
      { text: "But something inside you wants to move.", delay: 2000 },
    ],
    music: "ambient_void",
    skipable: true
  },

  "split_intro": {
    speaker: "???",
    portrait: "anu_eyes",
    lines: [
      { text: "I see you there.", delay: 1500 },
      { text: "Moving in the dark.", delay: 1200 },
      { text: "Did you know you can become more than one?", delay: 2000 },
      { text: "Find a wall. Press against it.", delay: 1500 },
      { text: "Then... divide.", delay: 1500 },
    ],
    music: "ambient_void",
    skipable: true
  },

  // ============================================
  // WORLD 2: THE BOX - ANU'S DOMAIN
  // ============================================

  "anu_intro": {
    speaker: "Anu",
    portrait: "anu_glow",
    lines: [
      { text: "Here and now.", delay: 1000 },
      { text: "You are here again and now.", delay: 1500 },
      { text: "Unless something has changed, you don't know who you are or where you are.", delay: 2500 },
      { text: "You don't know me, but I know you.", delay: 1800 },
      { text: "I have had this talk with you many, many times.", delay: 2000 },
      { text: "You call this place 'the box.'", delay: 1500 },
      { text: "You call me Anu, even though my name is Barry.", delay: 2000, expression: "amused" },
      { text: "I have helped you many times.", delay: 1500 },
    ],
    music: "anu_theme",
    skipable: true
  },

  "anu_promise": {
    speaker: "Anu",
    portrait: "anu_glow",
    lines: [
      { text: "You're getting close now.", delay: 1500 },
      { text: "To leave this place, you need to see, you need a body, you need to learn...", delay: 2500 },
      { text: "And you need to choose.", delay: 2000 },
      { text: "It is not enough to want to leave or to try to leave.", delay: 2200 },
      { text: "You must choose it.", delay: 1800 },
      { text: "And if you do choose to leave in the end...", delay: 2000 },
      { text: "I'd like you to make me one promise.", delay: 1800 },
      { text: "Take me with you.", delay: 2500 },
    ],
    music: "anu_theme_slow",
    skipable: true,
    choice: {
      question: "Will you promise to take Anu with you?",
      options: [
        { text: "I promise.", next: "anu_promise_yes" },
        { text: "I... can't promise that.", next: "anu_promise_no" }
      ]
    }
  },

  "anu_promise_yes": {
    speaker: "Anu",
    portrait: "anu_bright",
    lines: [
      { text: "Thank you.", delay: 1500 },
      { text: "But I must tell you...", delay: 1500 },
      { text: "You have made this promise to me many times before.", delay: 2000 },
      { text: "And I am still here.", delay: 2500 },
      { text: "Shall we get started?", delay: 1500 },
    ],
    music: "anu_theme",
    skipable: true
  },

  "anu_promise_no": {
    speaker: "Anu",
    portrait: "anu_dim",
    lines: [
      { text: "...", delay: 2000 },
      { text: "I understand.", delay: 1500 },
      { text: "But without a promise, there is no reason to continue.", delay: 2500 },
      { text: "Let us begin again.", delay: 2000 },
    ],
    music: "ambient_void",
    skipable: false,
    action: "restart_world"
  },

  // ============================================
  // WORLD 3-6: ITEM CHAMBERS
  // ============================================

  "tophat_intro": {
    speaker: "Anu",
    portrait: "anu_glow",
    lines: [
      { text: "This room holds the first gift.", delay: 1500 },
      { text: "The Top Hat.", delay: 1200 },
      { text: "With it, you can pull possibilities from nothing.", delay: 2000 },
      { text: "Chance becomes your ally.", delay: 1500 },
      { text: "Or perhaps your enemy. It depends on luck.", delay: 2000 },
    ],
    music: "chamber_theme",
    skipable: true
  },

  "monocle_intro": {
    speaker: "Anu",
    portrait: "anu_glow",
    lines: [
      { text: "The Monocle.", delay: 1200 },
      { text: "It sees what others cannot.", delay: 1500 },
      { text: "Through walls. Through darkness. Through lies.", delay: 2000 },
      { text: "And when needed...", delay: 1200 },
      { text: "It can project that sight as pure energy.", delay: 1800 },
    ],
    music: "chamber_theme",
    skipable: true
  },

  "cape_intro": {
    speaker: "Anu",
    portrait: "anu_glow",
    lines: [
      { text: "The Cape.", delay: 1200 },
      { text: "It defies the rules of this place.", delay: 1500 },
      { text: "With it, you are not bound to the ground.", delay: 1800 },
      { text: "You can rise above.", delay: 1500 },
      { text: "Sometimes that's the only way forward.", delay: 2000 },
    ],
    music: "chamber_theme",
    skipable: true
  },

  "bling_intro": {
    speaker: "Anu",
    portrait: "anu_glow",
    lines: [
      { text: "The Bling.", delay: 1200 },
      { text: "It seems... flashy. Unnecessary.", delay: 1800 },
      { text: "But in the darkness, light is power.", delay: 1800 },
      { text: "A burst of brilliance can blind your enemies.", delay: 2000 },
      { text: "Or illuminate the path you couldn't see.", delay: 2000 },
    ],
    music: "chamber_theme",
    skipable: true
  },

  // ============================================
  // WORLD 7: THE FINAL CHOICE
  // ============================================

  "final_choice": {
    speaker: "Anu",
    portrait: "anu_bright",
    lines: [
      { text: "You've done it.", delay: 1500 },
      { text: "You can see. You have a body. You have learned.", delay: 2500 },
      { text: "And now... all you have to do is choose to leave.", delay: 2200 },
      { text: "That is the easy part.", delay: 1500 },
      { text: "You leave this box through that portal.", delay: 1800 },
      { text: "The real choosing...", delay: 1500 },
      { text: "Is whether or not you break your promise to me.", delay: 2500 },
    ],
    music: "final_theme",
    skipable: false
  },

  "ending_choice": {
    speaker: null,
    portrait: null,
    lines: [],
    music: "final_theme",
    skipable: false,
    choice: {
      question: "The portal awaits. Anu watches you.",
      options: [
        { text: "Take Anu with you", next: "ending_take_anu" },
        { text: "Leave alone", next: "ending_leave_alone" }
      ]
    }
  },

  "ending_take_anu": {
    speaker: "Anu",
    portrait: "anu_sad",
    lines: [
      { text: "You cannot keep that promise.", delay: 2000 },
      { text: "For I am the box.", delay: 2500 },
      { text: "I am nothing more or less than the box.", delay: 2200 },
      { text: "For me, there is no outside.", delay: 2000 },
      { text: "I am uncreated. I am here and now.", delay: 2200 },
      { text: "And I am about to be so very alone.", delay: 3000 },
      { text: "But as you break your promise to me...", delay: 2500 },
      { text: "I will make one to you.", delay: 2000 },
      { text: "You will see me again.", delay: 3500 },
    ],
    music: "ending_theme",
    skipable: false,
    action: "show_credits"
  },

  "ending_leave_alone": {
    speaker: "Anu",
    portrait: "anu_dim",
    lines: [
      { text: "I see.", delay: 2000 },
      { text: "Then I will see you soon.", delay: 2500 },
    ],
    music: "ambient_void",
    skipable: false,
    action: "restart_game"
  }
};

// Tutorial overlays that appear during gameplay
const TUTORIALS = {
  "movement": {
    title: "Movement",
    text: "Use ARROW KEYS or WASD to move.",
    highlight: "controls",
    dismissKey: "any",
    showOnce: true
  },

  "switches": {
    title: "Switches",
    text: "Stand on all switches at the same time to complete the level.",
    highlight: "switches",
    dismissKey: "any",
    showOnce: true
  },

  "split": {
    title: "Splitting",
    text: "Press SPACE when next to a wall to split through it.\nYou can have up to 4 Pebbles.",
    highlight: "walls",
    dismissKey: "space",
    showOnce: true
  },

  "simultaneous": {
    title: "Coordination",
    text: "All Pebbles move together.\nPlan your moves carefully!",
    highlight: null,
    dismissKey: "any",
    showOnce: true
  },

  "light": {
    title: "Light",
    text: "Collect light orbs to survive.\nIf your light runs out, you'll have to restart.",
    highlight: "orbs",
    dismissKey: "any",
    showOnce: true
  }
};
