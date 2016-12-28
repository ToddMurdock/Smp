class MainController extends ViewController {
  onCardOneButtonClick (btn) {
    this.getViewModel().set('activeCard', 1);
  }

  onCardTwoButtonClick (btn) {
    this.getViewModel().set('activeCard', 2);
  }
}