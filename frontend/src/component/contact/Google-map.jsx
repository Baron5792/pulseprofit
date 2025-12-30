const GoogleMap = () => {
    // NOTE: Replace the placeholder URL below with a valid embed link from Google Maps!
    const validEmbedUrl = "https://maps.google.com/maps?q=123%20Main%20St&t=&z=13&ie=UTF8&iwloc=&output=embed";
    
    return (
        <div style={{ width: '100%', height: '700px' }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d79460.23840730482!2d-0.633841!3d51.510786!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48767b34f83eacd1%3A0xf70628179b68dfa7!2s32%20Daylesford%20Grove%2C%20Slough%20SL1%205AX%2C%20UK!5e0!3m2!1sen!2sng!4v1760359977277!5m2!1sen!2sng" 
                style={{ border: '0', width: '100%', height: '600px' }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    );
}

export default GoogleMap;