import { collection, DocumentData, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";

export async function getServices(): Promise<DocumentData | null> {
    try {
        const servicesCollectionRef = collection(db, "services");
        const servicesQuery = query(servicesCollectionRef);
        const servicesSnapshot = await getDocs(servicesQuery);
        const services = servicesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data
            }
        });

        return {
            services: services,
        };

    } catch (error) {
        console.error('Error fetching services:', error);
        return null;
    }
}

export async function getBarbers(): Promise<DocumentData | null> {
    try {
        const barbersCollectionRef = collection(db, "barbers");
        const barbersQuery = query(barbersCollectionRef);
        const barbersSnapshot = await getDocs(barbersQuery);
        const barbers = barbersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data
            }
        });

        return {
            barbers: barbers,
        };

    } catch (error) {
        console.error('Error fetching barbers:', error);
        return null;
    }
}