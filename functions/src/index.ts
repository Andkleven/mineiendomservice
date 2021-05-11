import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

exports.addUserClaims = functions.https.onCall((data, context) => {
  if (context.auth?.token?.admin !== true) {
    return {
      error: "Request not authorized. User must be a amin",
    };
  }
  const email = data.email;
  const admin = data.admin || false;
  const janitor = data.janitor || false;
  const building = data.building || false;
  return addUserClaims(email, admin, janitor, building).then(() => {
    return {
      result: `Request fulfilled! ${email} is now a admin`,
    };
  });
});

async function addUserClaims(
  email: string,
  adminRole: boolean,
  janitor: boolean,
  building: boolean
): Promise<void> {
  const user = await admin.auth().getUserByEmail(email);
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: adminRole,
    janitor,
    building,
  });
}
