import { createClient } from '@supabase/supabase-js';
const nodemailer = require('nodemailer');

const supabaseUrl = process.env.SUPABASE_URL || 'https://alvwqkqsokaiarrmweht.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { items, orderData } = body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    try {
        let subtotal = 0;
        for (const item of items) {
            subtotal += item.price * item.quantity;
        }

        const totalAmount = subtotal;

        // Update existing order or create new
        let data, error;
        
        const orderDataToSave = {
            email: orderData.email,
            first_name: orderData.firstName,
            last_name: orderData.lastName,
            total_amount: totalAmount,
            status: 'pending',
            order_data: orderData,
            items: items
        };

        if (body.orderId) {
            const res = await supabase
                .from('orders')
                .update(orderDataToSave)
                .eq('id', body.orderId)
                .select();
            data = res.data;
            error = res.error;
        } else {
            const res = await supabase
                .from('orders')
                .insert([orderDataToSave])
                .select();
            data = res.data;
            error = res.error;
        }
            
        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: 'Erreur lors de la création de la commande' });
        }

        
        if (orderData.payment_method === "bank" && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });
                
                const itemsList = items.map(i => `${i.quantity}x ${i.name || i.title}`).join('\n');
                const mailOptions = {
                    from: '"Airton Shop" <service-client@airton-shop.eu>',
                    to: 'service-client@airton-shop.eu',
                    subject: 'Nouvelle Commande (Virement Bancaire) - #' + data[0].id,
                    text: `Nouvelle commande passée par ${orderData.firstName} ${orderData.lastName} (${orderData.email}).

Montant total: ${totalAmount} €
Méthode: Virement Bancaire

Produits:
${itemsList}

Détails de livraison:
Adresse: ${orderData.address}
Ville: ${orderData.city}
Code Postal: ${orderData.zipcode}
Pays: ${orderData.country}
Tel: ${orderData.phone}`
                };
                await transporter.sendMail(mailOptions);

                // Send email to customer
                if (orderData.email) {
                    try {
                        const customerMailOptions = {
                            from: '"Airton Shop" <service-client@airton-shop.eu>',
                            to: orderData.email,
                            subject: 'Confirmation de votre commande Airton',
                            html: `

                            <!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            </head>
                            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #faebd7 0%, #e0f7fa 100%); padding: 30px 10px; color: #111; text-align: center;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; width: 100%; margin: 0 auto; text-align: center;">
                                                <tr>
                                                    <td align="center">
                                                        <img src="https://airton.shop/cdn/shop/files/Logo_Airton_2025_Noir_2.svg" alt="Airton" style="height: 35px; margin-bottom: 20px;">
                                                        <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">Votre commande est confirmée !</h2>
                                                        <p style="font-size: 13px; color: #555; margin-bottom: 30px; line-height: 1.5;">
                                                            Si vous constatez une erreur dans votre commande,<br>
                                                            contactez nous à l'adresse : <a href="mailto:service-client@airton-shop.eu" style="color: #016FD0; text-decoration: none; word-break: break-all;">service-client@airton-shop.eu</a>
                                                        </p>
                                                        <h3 style="font-size: 18px; margin-bottom: 5px;">Détail de votre commande.</h3>
                                                        <p style="font-size: 16px; margin-bottom: 25px; font-weight: bold;">Commande <span style="color: #016FD0;">#${data[0].id}</span>.</p>
                                                        
                                                        <div style="background-color: #ffffff; border-radius: 8px; padding: 15px; margin-bottom: 30px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                                                            ${items.map(item => `
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                                                                <tr>
                                                                    <td width="55" valign="middle">
                                                                        ${(item.image_url || item.image) ? `<img src="${item.image_url || item.image}" width="45" height="45" style="border-radius: 4px; object-fit: cover; border: 1px solid #eaeaea; display: block;" />` : `<div style="width: 45px; height: 45px; background: #f8f9fa; border: 1px solid #eaeaea; border-radius: 4px;"></div>`}
                                                                    </td>
                                                                    <td valign="middle" style="padding-left: 10px; font-size: 12px;">
                                                                        ${item.title || item.name}
                                                                    </td>
                                                                    <td width="30" align="right" valign="middle" style="font-size: 12px; color: #777;">
                                                                        x${item.quantity}
                                                                    </td>
                                                                    <td width="60" align="right" valign="middle" style="font-size: 12px; font-weight: 500;">
                                                                        ${Number(item.price).toFixed(2).replace('.', ',')}€
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            `).join('')}
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding-top: 5px;">
                                                                <tr>
                                                                    <td valign="middle" style="font-size: 13px; color: #555;">Montant total :</td>
                                                                    <td align="right" valign="middle" style="font-size: 18px; font-weight: bold;">
                                                                        ${Number(totalAmount).toFixed(2).replace('.', ',')}€
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>

                                                        <a href="mailto:service-client@airton-shop.eu?subject=Demande%20de%20facture%20pour%20la%20commande%20%23${data[0].id}" style="display: inline-block; background-color: #2b8cff; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 30px; font-weight: 600; font-size: 14px; margin-bottom: 25px;">
                                                            Télécharger ma facture
                                                        </a>

                                                        <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); text-align: left;">
                                                            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
                                                                <h4 style="margin: 0 0 10px 0; font-size: 14px;">Adresse de facturation</h4>
                                                                <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.5;">
                                                                    ${orderData.firstName || ''} ${orderData.lastName || ''}<br>
                                                                    ${orderData.phone || ''}<br>
                                                                    <a href="mailto:${orderData.email}" style="color: #016FD0; text-decoration: none; word-break: break-all;">${orderData.email}</a><br>
                                                                    ${orderData.city || ''}, ${orderData.country || ''}<br>
                                                                    ${orderData.zipcode || ''}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 style="margin: 0 0 10px 0; font-size: 14px;">Adresse de livraison</h4>
                                                                <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.5;">
                                                                    ${orderData.firstName || ''} ${orderData.lastName || ''}<br>
                                                                    ${orderData.phone || ''}<br>
                                                                    <a href="mailto:${orderData.email}" style="color: #016FD0; text-decoration: none; word-break: break-all;">${orderData.email}</a><br>
                                                                    ${orderData.city || ''}, ${orderData.country || ''}<br>
                                                                    ${orderData.zipcode || ''}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <h3 style="font-size: 16px; color: #2b8cff; margin-bottom: 20px; font-weight: bold; text-align: center;">Si vous payez par virement bancaire.</h3>
                                                        
                                                        <div style="background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                                                            <div style="padding-bottom: 15px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea;">
                                                                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #222;">Téléchargez notre RIB <a href="https://airton-shop.eu/pages/bank-details?ref=${data[0].id}&amount=${totalAmount}" style="color: #2b8cff; text-decoration: none;">ici</a></p>
                                                            </div>
                                                            <div style="padding-bottom: 15px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea;">
                                                                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #222;">Faire le virement avec la référence <span style="color: #2b8cff;">#${data[0].id}</span></p>
                                                            </div>
                                                            <div>
                                                                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #222;">Envoyer le justificatif à <a href="mailto:service-client@airton-shop.eu" style="color: #2b8cff; text-decoration: none; word-break: break-all;">service-client@airton-shop.eu</a></p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                                            <p style="margin: 0; font-size: 12px; color: #888;">Pour toute question, contactez notre service client : <a href="mailto:service-client@airton-shop.eu" style="color: #016FD0; text-decoration: none; word-break: break-all;">service-client@airton-shop.eu</a></p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            </body>
                            </html>
                            `
                        };
                        await transporter.sendMail(customerMailOptions);
                    } catch(e) {
                        console.error("Failed to send customer email", e);
                    }
                }

            } catch(e) {
                console.error("Failed to send admin email", e);
            }
        }

        res.status(200).json({ success: true, orderId: data[0].id });
    } catch (err) {
        console.error('Bank Transfer API Error:', err);
        res.status(500).json({ error: err.message });
    }
}
