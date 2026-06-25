import { CONFIG } from "./config";
import { removePreviousArtifacts } from "./utils";

export const getOrCreateCard = () => {
  let card = document.getElementById(CONFIG.cardId);
  if (card) return card;
  card = document.createElement("div");
  card.id = CONFIG.cardId;
  const notifyEl = document.getElementById("notify_my_check_in_data");
  const checkinDetail = document.getElementById("my-checkin-detail");
  if (notifyEl?.parentElement) notifyEl.parentElement.insertBefore(card, notifyEl);
  else if (checkinDetail?.parentElement)
    checkinDetail.parentElement.insertBefore(card, checkinDetail);
  else document.body.prepend(card);
  return card;
};

export const initDom = () => {
  removePreviousArtifacts();
  getOrCreateCard();
};
