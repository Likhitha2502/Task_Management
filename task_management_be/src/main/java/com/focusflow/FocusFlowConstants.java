package com.focusflow;

public final class FocusFlowConstants {

    public static final String TODO = "TODO";
    public static final String IN_PROGRESS = "IN PROGRESS";
    public static final String REVIEW = "REVIEW";
    public static final String DONE = "DONE";

    public static final String EMAIL_SUBJECT =
            "TaskManagementK2G - Your Temporary Password Has Arrived 🚀";

    private FocusFlowConstants() {
    }

    public static String getTemporaryPasswordEmail(String tempPassword) {
        return
                "Hey there,\n\n" +
                        "Good news — your temporary password is ready for duty.\n\n" +

                        "Temp Password: " + tempPassword + "\n\n" +

                        "Use it to log in, then swap it out for a new password " +
                        "you’ll actually remember (or immediately forget again — we don’t judge).\n\n" +

                        "A few important notes:\n" +
                        "- This password is temporary\n" +
                        "- It has commitment issues\n" +
                        "- It would really like to retire soon\n\n" +

                        "Thanks for using TaskManagementK2G ✨\n\n" +

                        "— The TaskManagementK2G Team\n" +
                        "Doing productive things so you can pretend you are too";
    }

    public static String normalizeTaskStatus(String status) {

        if (status == null) {
            return null;
        }

        return status
                .trim()
                .replace("_", " ")
                .toUpperCase();
    }

    public static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,16}$";

    public static final String PASSWORD_VALIDATION_MESSAGE =
            "Password must be 8-16 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character";
}