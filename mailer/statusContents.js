module.exports = {
  inProcess: {
    subject: '🤖Your Document is still in process🔄',
    text: "Hello {{name}},\n\nYour document with number {{documentNumber}} is still in process🔄.\n\nlink: {{link}} \n\nBest regards,\n{{botArmy}}",
  },
  ready: {
    subject: '🤖Your Document is ready🎊',
    text: "Hello {{name}},\n\nYour document with number {{documentNumber}} is ready🎁.\n\nlink: {{link}} \n\nBest regards,\n{{botArmy}}",
  },
  unknown: {
    subject: '🤖Unable to determine the status🤔',
    text: "Hello {{name}},\n\nWe are unable to determine the status of your document with number {{documentNumber}}❓. Please check the website for more details.\n\nlink: {{link}} \n\nBest regards,\n{{botArmy}}",
  },
}