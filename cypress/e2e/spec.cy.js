const expectPlayingAudio = () => {
  cy.get('audio,video').should((els)=>{
    let audible = false
    els.each((i, el)=>{
      if (el.duration > 0 ) {
        audible = true
      }
    })
    expect(audible).to.eq(true)
  })
}



describe('Voice recorder front page', () => {
  before(() => {
    cy.visit('http://localhost:3000/')
  })
  
  it('should be visible', () => {
    cy.get('[test-id="title"]').should('be.visible')
    cy.contains('Your audio').should('be.visible')
  })
  
  it('test recording process', () => {
      cy.on('uncaught:exception', (err, runnable) => {
        expect(err.message).to.include('something about the error')
    
        done()
        return false
      })
    
      cy.get('[test-id="buttonStart"]').should('be.visible').click()
      cy.wait(1000)
      cy.get('[test-id="buttonStop"]').should('be.visible').click()
      cy.get('audio')
      .invoke('attr', 'src')
      .then((audiofile) => {
        const audio = new Audio(audiofile);
        audio.play();
      });
      expectPlayingAudio()
      cy.get('[test-id="buttonCancel"]').should('be.visible').click()
      cy.get('audio').should('not.exist')
  })
})
